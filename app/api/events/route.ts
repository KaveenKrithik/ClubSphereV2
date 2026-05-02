
import { NextResponse } from 'next/server';

// ==========================================
// HELPERS
// ==========================================
const now = new Date();

function isExpired(dateStr: string): boolean {
  try {
    // Handle various formats: "September 1, 2025", "May 8, 2026", "27th Apr 2026"
    const cleaned = dateStr
      .replace(/(\d+)(st|nd|rd|th)/i, '$1') // "27th" -> "27"
      .replace(/,?\s*-.*$/, '');              // "Sept 1-10, 2025" -> "Sept 1 2025"
    const parsed = new Date(cleaned);
    if (!isNaN(parsed.getTime())) {
      return parsed < now;
    }
  } catch { /* ignore */ }
  // If we can't parse, keep it (don't filter)
  return false;
}

function filterActive(events: any[]): any[] {
  return events.filter(e => !isExpired(e.date));
}

// ==========================================
// YOUR ORIGINAL BASE EVENTS
// ==========================================
const BASE_HACKATHONS = [
  {
    id: "h1",
    title: "IoTAlliance Recruitments 2026",
    description: "IoTAlliance Space Station is recruiting new crew members across three critical domains.",
    date: "September 1, 2026",
    venue: "SRMIST",
    image: "/rec.jpeg",
    isExternal: true,
    enrollmentLink: "https://iota-recruitment-web.vercel.app/",
  },
  {
    id: "h2",
    title: "Postman Notebooks Challenge",
    description: "Postman Notebooks Challenge - API Innovation.",
    date: "September 1, 2026",
    venue: "Virtual Event",
    image: "/bits.png",
    isExternal: true,
    enrollmentLink: "https://unstop.com/competitions/1533773/register",
  },
  {
    id: "h3",
    title: "SuperHack 2026",
    description: "Join SuperHack, the global AI hackathon for developers powering the next wave of IT.",
    date: "September 10, 2026",
    venue: "Virtual Event",
    image: "/sup.webp",
    isExternal: true,
    enrollmentLink: "https://vision.hack2skill.com/event/superhack2026/registration",
  },
  {
    id: "h4",
    title: "SMART PAPER_SHREDDER HACKATHON 2026",
    description: "Development of Working Model",
    date: "September 15, 2026",
    venue: "SRM Institute of Science and Technology Kattankulathur Campus",
    image: "/smart.png",
    isExternal: false,
    enrollmentLink: "https://docs.google.com/forms/d/e/1FAIpQLScuy77yVpCfcjqogbSbl3ZS3vopF97i4o5cZiu6PjYV748J1Q/viewform",
  },
  {
    id: "h5",
    title: "Global Tech Innovators Hackathon",
    description: "Build the future of technology in this 48-hour global competition.",
    date: "October 5, 2026",
    venue: "Virtual",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000",
    isExternal: true,
    enrollmentLink: "#",
  },
  {
    id: "h6",
    title: "Green Earth Hack 2026",
    description: "Develop sustainable solutions for a greener planet.",
    date: "October 12, 2026",
    venue: "SRMIST",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=1000",
    isExternal: false,
    enrollmentLink: "#",
  },
  {
    id: "h7",
    title: "FinTech Revolution",
    description: "Reimagining the world of finance with blockchain and AI.",
    date: "October 20, 2026",
    venue: "Virtual",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000",
    isExternal: true,
    enrollmentLink: "#",
  },
  {
    id: "h8",
    title: "HealthTech Challenge",
    description: "Innovate in the healthcare space with cutting-edge technology.",
    date: "November 1, 2026",
    venue: "Chennai",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000",
    isExternal: true,
    enrollmentLink: "#",
  }
];

const BASE_WORKSHOPS = [
  {
    id: "w1",
    title: "Biomass Fermentation Workshop 2026",
    description: "Hands-on training on Separation of Lignin, Cellulose and Hemi Cellulose.",
    date: "August 18, 2026",
    venue: "Sathyabama Institute of Science and Technology, Chennai",
    image: "/bio.jpg",
    isExternal: true,
    enrollmentLink: "https://docs.google.com/forms/d/1hiZ2ZCC6pZuULj4wrlw6poHpC3VLNtxtAs8RhYNlIF4/viewform",
  },
  {
    id: "w2",
    title: "Hack & Beyond 2026",
    description: "Automotive Embedded Systems and AI-powered Embedded Solutions.",
    date: "August 11, 2026",
    venue: "SRM Institute of Science and Technology Kattankulathur Campus",
    image: "/hack.jpeg",
    isExternal: false,
    enrollmentLink: "https://docs.google.com/forms/d/e/1FAIpQLScAEzF1r7pJmBicPGLFT6No_jpW95y4Ec_LaOFeHmyJjAUNAQ/closedform",
  },
  {
    id: "w3",
    title: "IoT and Embedded System Workshop 2026",
    description: "Understanding IoT and Embedded system fundamentals.",
    date: "August 30, 2026",
    venue: "IIT Madras, Research Park",
    image: "/top.jpeg",
    isExternal: true,
    enrollmentLink: "https://pages.razorpay.com/pl_Qt1iU1xhftJ2k7/view",
  },
  {
    id: "w4",
    title: "Digital Twin Workshop 2026",
    description: "Top Engineers Workshop on Digital Twins and IoT",
    date: "August 24, 2026",
    venue: "IIT Madras, Research Park",
    image: "/iitm.jpeg",
    isExternal: true,
    enrollmentLink: "https://pages.razorpay.com/pl_QtPs47oh1aOqjc/view",
  }
];

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

  return {
    id: `unstop-${item.id}`,
    title: item.title || 'Untitled Event',
    description: `${item.title || ''} — by ${item.organisation?.name || 'Unstop'}`,
    date: dateStr,
    venue: typeof venue === 'string' ? venue : 'Online',
    image,
    isExternal: true,
    enrollmentLink: item.seo_url || `https://unstop.com/${item.public_url}`,
    _type: item.type,       // "hackathons" or "workshops"
    _subtype: item.subtype,  // "online_coding_challenge", "workshops", etc.
  };
}

async function fetchUnstop(): Promise<{ hackathons: any[]; workshops: any[] }> {
  try {
    const res = await fetch(
      'https://unstop.com/api/public/opportunity/search-result?oppstatus=open&per_page=50',
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
    ).slice(0, 15);
    const workshops = items.filter((i: any) =>
      i._type === 'workshops' || i._subtype === 'workshops' || i._subtype === 'webinars'
    ).slice(0, 15);

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
const WORKSHOP_BADGES = [
  'faculty development program', 'workshop', 'conference',
  'international conference', 'summer internship program',
  'internship training', 'symposium', 'seminar', 'fdp',
];

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

  return {
    title,
    description: badge ? `${badge} — ${title}` : title,
    date: dateStr,
    venue: location,
    image,
    isExternal: true,
    enrollmentLink: `https://www.knowafest.com/${link}`,
    _badge: badge.toLowerCase(),
  };
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
        if (hackathons.length < 15) {
          hackathons.push({ id: `kf-h-${hackathons.length}`, ...event });
        }
      } else {
        // Everything else goes to workshops
        if (workshops.length < 15) {
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

  // Merge all hackathons and workshops
  const allHackathons = [...BASE_HACKATHONS, ...unstop.hackathons, ...knowafest.hackathons];
  const allWorkshops = [...BASE_WORKSHOPS, ...unstop.workshops, ...knowafest.workshops];

  // Filter out expired events
  const activeHackathons = filterActive(allHackathons);
  const activeWorkshops = filterActive(allWorkshops);

  return NextResponse.json({
    hackathons: activeHackathons,
    workshops: activeWorkshops,
  });
}
