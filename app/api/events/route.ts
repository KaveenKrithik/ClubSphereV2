
import { NextResponse } from 'next/server';

// ==========================================
// HELPERS
// ==========================================
const now = new Date();
const twoMonthsFromNow = new Date();
twoMonthsFromNow.setMonth(now.getMonth() + 2);

function isRelevant(dateStr: string): boolean {
  try {
    const cleaned = dateStr
      .replace(/(\d+)(st|nd|rd|th)/i, '$1')
      .replace(/,?\s*-.*$/, '');
    const parsed = new Date(cleaned);
    if (!isNaN(parsed.getTime())) {
      // Must be in the future AND within 2 months
      return parsed >= now && parsed <= twoMonthsFromNow;
    }
  } catch { /* ignore */ }
  // If we can't parse, keep it as 'Upcoming'
  return true;
}

function filterActive(events: any[]): any[] {
  return events.filter(e => isRelevant(e.date));
}

function isSRMEvent(event: any): boolean {
  const srmPattern = /SRM|Kattankulathur|KTR|Ramapuram|Vadapalani|Modinagar|NCR/i;
  return (
    srmPattern.test(event.title) ||
    srmPattern.test(event.description || '') ||
    srmPattern.test(event.venue || '')
  );
}

function sortEvents(events: any[]): any[] {
  return events.sort((a, b) => {
    // 1. Internal Priority (Internal first)
    if (a.isInternal !== b.isInternal) {
      return a.isInternal ? -1 : 1;
    }
    
    // 2. Date Priority (Chronological)
    const dateA = new Date(a.date.replace(/(\d+)(st|nd|rd|th)/i, '$1')).getTime();
    const dateB = new Date(b.date.replace(/(\d+)(st|nd|rd|th)/i, '$1')).getTime();
    
    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;
    
    return dateA - dateB;
  });
}

// ==========================================
// UNSTOP SCRAPER
// Fetches both hackathons AND workshops
// ==========================================
function parseUnstopItem(item: any): any {
  // Use org's full-size logo (works), fallback to 150x150 thumbnail
  const image = item.organisation?.logoUrl || item.logoUrl2 || '';

  const endDate = item.regnRequirements?.end_regn_dt || item.end_date;
  let dateStr = 'Upcoming';
  if (endDate) {
    try {
      dateStr = new Date(endDate).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      });
    } catch { /* keep 'Upcoming' */ }
  }

  const addr = item.address_with_country_logo;
  const venue = addr?.city || addr?.state || 'Online';

  const event = {
    id: `unstop-${item.id}`,
    title: item.title || 'Untitled Event',
    description: `${item.title || ''} — by ${item.organisation?.name || 'Unstop'}`,
    date: dateStr,
    venue: typeof venue === 'string' ? venue : 'Online',
    image,
    isExternal: true, // Default to true, will be overwritten by isSRM check
    isInternal: false,
    enrollmentLink: item.seo_url || `https://unstop.com/${item.public_url}`,
    _type: item.type,       // "hackathons" or "workshops"
    _subtype: item.subtype,  // "online_coding_challenge", "workshops", etc.
  };

  if (isSRMEvent(event)) {
    event.isInternal = true;
    event.isExternal = false;
  }

  return event;
}

async function fetchUnstop(): Promise<{ hackathons: any[]; workshops: any[] }> {
  try {
    const res = await fetch(
      'https://unstop.com/api/public/opportunity/search-result?oppstatus=open&per_page=100',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
      }
    );
    if (!res.ok) return { hackathons: [], workshops: [] };
    const json = await res.json();
    const items = (json.data?.data || json.data || []).map(parseUnstopItem);

    // Split by type
    const hackathons = items.filter((i: any) =>
      i._type === 'hackathons' || i._subtype === 'online_coding_challenge'
    ).slice(0, 40); // Increased limit for broader discovery
    const workshops = items.filter((i: any) =>
      i._type === 'workshops' || i._subtype === 'workshops' || i._subtype === 'webinars'
    ).slice(0, 40);

    // Clean up internal fields
    const clean = (arr: any[]) => arr.map(({ _type, _subtype, ...rest }) => rest);
    return { hackathons: clean(hackathons), workshops: clean(workshops) };
  } catch (e) {
    console.error('[Unstop] Fetch failed:', e);
    return { hackathons: [], workshops: [] };
  }
}

// ==========================================
// KNOWAFEST SCRAPER
// Splits events into hackathons vs workshops
// based on badge/category
// ==========================================
const HACKATHON_BADGES = ['hackathon'];

function parseKnowAFestCard(link: string, content: string): any | null {
  const imgMatch = content.match(/src="([^"]+)"/);
  const image = imgMatch ? imgMatch[1] : '';

  const badgeMatch = content.match(/class="badge[^"]*">(.*?)<\/span>/);
  const badge = badgeMatch ? badgeMatch[1].trim() : '';

  const titleMatch = content.match(/class="card-text">([\s\S]*?)<\/p>/);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const locMatch = content.match(/card-body">\s*<p>\s*([\s\S]*?)<span/);
  const location = locMatch ? locMatch[1].replace(/\s+/g, ' ').trim() : 'College Campus';

  const dateMatch = content.match(/<\/span>\s*(\d+\w*\s+\w+\s+\d{4})/);
  let dateStr = 'Upcoming';
  if (dateMatch) {
    try {
      const cleaned = dateMatch[1].trim().replace(/(\d+)(st|nd|rd|th)/i, '$1');
      const parsed = new Date(cleaned);
      if (!isNaN(parsed.getTime())) {
        dateStr = parsed.toLocaleDateString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric',
        });
      }
    } catch { /* keep Upcoming */ }
  }

  if (title.length <= 3) return null;

  const event = {
    title,
    description: badge ? `${badge} — ${title}` : title,
    date: dateStr,
    venue: location,
    image,
    isExternal: true,
    isInternal: false,
    enrollmentLink: `https://www.knowafest.com/${link}`,
    _badge: badge.toLowerCase(),
  };

  if (isSRMEvent(event)) {
    event.isInternal = true;
    event.isExternal = false;
  }

  return event;
}

async function fetchKnowAFest(): Promise<{ hackathons: any[]; workshops: any[] }> {
  try {
    const res = await fetch('https://www.knowafest.com/explore/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    if (!res.ok) return { hackathons: [], workshops: [] };
    const html = await res.text();

    const hackathons: any[] = [];
    const workshops: any[] = [];

    const cardRegex = /class="card card-ghost[^"]*"[^>]*href="([^"]*)">([\s\S]*?)<\/a>/g;
    let match;

    while ((match = cardRegex.exec(html)) !== null) {
      const parsed = parseKnowAFestCard(match[1], match[2]);
      if (!parsed) continue;

      const { _badge, ...event } = parsed;

      if (HACKATHON_BADGES.some(b => _badge.includes(b))) {
        if (hackathons.length < 40) {
          hackathons.push({ id: `kf-h-${hackathons.length}`, ...event });
        }
      } else {
        // Everything else goes to workshops
        if (workshops.length < 40) {
          workshops.push({ id: `kf-w-${workshops.length}`, ...event });
        }
      }
    }

    return { hackathons, workshops };
  } catch (e) {
    console.error('[KnowAFest] Fetch failed:', e);
    return { hackathons: [], workshops: [] };
  }
}

// ==========================================
// API ROUTE
// ==========================================
export async function GET() {
  const [unstopResult, knowafestResult] = await Promise.allSettled([
    fetchUnstop(),
    fetchKnowAFest(),
  ]);

  const unstop = unstopResult.status === 'fulfilled' ? unstopResult.value : { hackathons: [], workshops: [] };
  const knowafest = knowafestResult.status === 'fulfilled' ? knowafestResult.value : { hackathons: [], workshops: [] };

  // Merge only newly fetched hackathons and workshops
  const allHackathons = [...unstop.hackathons, ...knowafest.hackathons];
  const allWorkshops = [...unstop.workshops, ...knowafest.workshops];

  // Filter out expired events
  const activeHackathons = sortEvents(filterActive(allHackathons));
  const activeWorkshops = sortEvents(filterActive(allWorkshops));

  return NextResponse.json({
    hackathons: activeHackathons,
    workshops: activeWorkshops,
  });
}
