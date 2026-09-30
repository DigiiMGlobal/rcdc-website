/* =========================================================
   RCDC · Cosmic Renaissance · RIY 2026–27
   ALL SITE CONTENT LIVES HERE.
   Edit this file to update the team, avenues, calendar,
   Hall of Fame, reels or contact details. Dahico (the
   chatbot) reads from this file too.
   ========================================================= */

const RCDC = {
  club: {
    name: "Rotaract Club of Dahisar Coast",
    short: "RCDC",
    year: "RIY 2026–27",
    theme: "Cosmic Renaissance",
    tagline: "A new universe. A new chapter. Limitless possibilities.",
    quote: "We don't wait for a new universe. We create one.",
    pillars: ["Friendship", "Leadership", "Service", "Impact"],
    district: "District 3141",
    zone: "Zone 2",
    installation: "38th Installation",
    sponsor: "Rotary Club of Mumbai Dahisar"
  },

  contact: {
    email: "dahisarcoast05@gmail.com",
    phone: "7549973518",
    phoneIntl: "+917549973518",
    website: "rotaractclubofdahisarcoast.in",
    instagram: "rcdahisarcoast",
    instagramUrl: "https://www.instagram.com/rcdahisarcoast/",
    form: "https://forms.gle/BMg97UySgxQqiCVs8",
    membershipLead: "Rtr. Manaswi Mishra, Secretary"
  },

  /* ---------- Theme words ---------- */
  universe: [
    { word: "Explore", meaning: "Step beyond comfort zones." },
    { word: "Create",  meaning: "Turn ideas into experiences." },
    { word: "Lead",    meaning: "Take initiative and create change." },
    { word: "Connect", meaning: "Build friendships, partnerships and communities." },
    { word: "Impact",  meaning: "Leave every place a little brighter than we found it." }
  ],

  identity: [
    "Serving with purpose",
    "Leading with empathy",
    "Creating with courage",
    "Growing together",
    "Celebrating every journey"
  ],

  /* ---------- Avenues (9) ----------
     leads = directors for that avenue (names must match the team lists) */
  avenues: [
    {
      id: "fellowship", name: "Club Service & Fellowship", short: "Fellowship", icon: "users", color: "#3FC1C9",
      text: "Building the spirit of RCDC beyond projects, this avenue focuses on creating a strong sense of belonging, friendship, and togetherness. Through engaging activities and memorable experiences, we turn members into a community that grows, celebrates, and serves together.",
      leads: ["Rtr. Vijay Verma", "Rtr. Soham Rathi"]
    },
    {
      id: "community", name: "Community Service", short: "Community", icon: "heart", color: "#E0529C",
      text: "Driven by the spirit of service, this avenue transforms compassion into meaningful action. From grassroots initiatives to impactful community projects, we strive to create sustainable change and leave every community we touch a little better than before.",
      leads: ["Rtr. Dhruvi Satia", "Rtr. Anurag Nirgun"]
    },
    {
      id: "professional", name: "Professional Development", short: "Professional", icon: "briefcase", color: "#E6BC5C",
      text: "Preparing our members for the world beyond the club, this avenue focuses on building skills, confidence, and professional excellence. Through workshops, mentorship, networking, and industry exposure, we empower members to discover and reach their potential.",
      leads: ["Rtr. Dhruv Singh", "Rtr. Sanika Kadam"]
    },
    {
      id: "entrepreneurship", name: "Entrepreneurship Development", short: "Entrepreneurship", icon: "rocket", color: "#F08A4B",
      text: "Fueling ideas into possibilities, this avenue encourages members to think creatively, take initiative, and build with purpose. Through entrepreneurial experiences, learning opportunities, and collaboration, we nurture the innovators and changemakers of tomorrow.",
      leads: ["Rtr. Dhruv Singh", "Rtr. Sanika Kadam"]
    },
    {
      id: "international", name: "International Service", short: "International", icon: "globe", color: "#5B8DEF",
      text: "Connecting RCDC with the world, this avenue celebrates global collaboration, cultural exchange, and service beyond borders. We create opportunities for members to engage with international communities and turn global connections into shared impact.",
      leads: ["Rtr. Khooshi Vora", "Rtr. Neelangi Mehta"]
    },
    {
      id: "pr", name: "PR & Marketing", short: "PR & Marketing", icon: "megaphone", color: "#B863D9",
      text: "The voice and face of RCDC, this avenue brings our stories, projects, and achievements into the spotlight. Through strategic communication, branding, outreach, and storytelling, we build a strong identity and make sure our impact is seen and remembered.",
      leads: ["Rtr. Naitik Vora"]
    },
    {
      id: "digital", name: "Digital Media & Publications", short: "Digital Media", icon: "camera", color: "#7A5CD6",
      text: "Where creativity meets communication, this avenue captures and showcases the RCDC experience through digital content and publications. From engaging social media campaigns to creative designs and documentation, we turn moments into stories that live beyond the year.",
      leads: ["Rtr. Shraddha Nagrani", "Rtr. Aayush Dubey", "Rtr. Suhani Chavda"]
    },
    {
      id: "partners", name: "Partners in Service", short: "Partners", icon: "handshake", color: "#E8766A",
      text: "Service becomes stronger when we serve together. This avenue focuses on building meaningful collaborations with our parent Rotary club, Interact clubs, and other community partners to combine resources, ideas, and strengths for greater collective impact.",
      leads: ["Rtr. Jay Rathod"]
    },
    {
      id: "youth", name: "Youth & Member Development", short: "Youth & Members", icon: "sprout", color: "#7ED0A8",
      text: "At the heart of RCDC are its people. This avenue focuses on nurturing leadership, confidence, creativity, and personal growth while creating opportunities for every member to learn, lead, and discover their own potential.",
      leads: ["Rtr. Khooshi Vora"]
    }
  ],

  /* ---------- Stories (projects) ---------- */
  memories: [
    {
      tag: "Legacy Project", title: "Om Morya Re", img: "om-morya-re",
      alt: "RCDC members gathered around Bappa at Om Morya Re",
      text: "Our beloved legacy Ganesh Chaturthi project: a celebration of devotion, community and togetherness. More than an event, Om Morya Re represents the spirit of RCDC coming together to welcome Bappa with enthusiasm, responsibility and heart."
    },
    {
      tag: "Fellowship", title: "Creativerse", img: "creativerse",
      alt: "Members at the Creativerse potluck Dabba Party with the food spread",
      text: "A space where creativity and fellowship came together, with a potluck Dabba Party and a Canva workshop creating an experience that was as fun as it was creative."
    },
    {
      tag: "Ganeshotsav", title: "Ganpati with Grace 2.0", img: "ganpati-with-grace",
      alt: "RCDC members each holding a Ganpati idol at Ganpati with Grace 2.0",
      text: "Held on 20 September 2026, Ganpati with Grace 2.0 brought RCDC members together to welcome Bappa, each with an idol of their own."
    },
    {
      tag: "Fellowship", title: "Yaaro ki Mehfil", img: "yaaro-ki-mehfil",
      alt: "RCDC members together at Yaaro ki Mehfil",
      text: "Held on 2 August 2026, Yaaro ki Mehfil was a fellowship meet that brought the RCDC family together, simply to spend time as friends."
    }
  ],

  /* ---------- Photo wall ---------- */
  gallery: [
    { src: "team-2026-27", cap: "Acensus · the 2026–27 board installed" },
    { src: "ganpati-with-grace", cap: "Ganpati with Grace 2.0" },
    { src: "nature-pathfinder-trek", cap: "Nature Pathfinder trek" },
    { src: "oldage-home-visit", cap: "Old age home visit" },
    { src: "holi", cap: "Holi" },
    { src: "acensus-collar", cap: "The collar passes on · Acensus" },
    { src: "yaaro-ki-mehfil", cap: "Yaaro ki Mehfil" },
    { src: "jingle-boxes", cap: "Jingle Boxes" },
    { src: "garba", cap: "Garba night" },
    { src: "awareness-session", cap: "An awareness session with students" },
    { src: "ocv-2025-26", cap: "OCV 2025–26" },
    { src: "rcdc-family-1", cap: "The RCDC family" },
    { src: "district-assembly", cap: "Elixir · District Assembly & AARA Night, 11 July 2026" },
    { src: "rcdc-family-2", cap: "The RCDC family" },
    { src: "goals-summit", cap: "GOALS 2026–27 leadership summit · Silvassa" },
    { src: "creativerse", cap: "Creativerse · the Dabba Party spread" }
  ],

  heroDeck: [
    { src: "team-2026-27", cap: "The Team 2026–27" },
    { src: "om-morya-re", cap: "Om Morya Re" },
    { src: "nature-pathfinder-trek", cap: "Nature Pathfinder trek" },
    { src: "holi", cap: "Holi" },
    { src: "garba", cap: "Garba night" },
    { src: "yaaro-ki-mehfil", cap: "Yaaro ki Mehfil" }
  ],

  littleThings: [
    "A first project", "A new friendship", "A crazy team meeting",
    "A successful event after weeks of chaos", "A member discovering their confidence",
    "A team celebrating at 2 AM"
  ],

  legacy: [
    { area: "Meaningful Collaborations", text: "Working alongside Rotaract clubs, institutions and communities to create larger impact." },
    { area: "Community Impact", text: "Taking up initiatives across social causes, awareness, education, health and civic responsibility." },
    { area: "Youth Leadership", text: "Creating opportunities for young people to step forward, take responsibility and lead." },
    { area: "Creative Innovation", text: "Bringing fresh ideas and unconventional approaches to projects and communication." },
    { area: "Strong Fellowship", text: "Building a culture where professional growth and genuine friendships coexist." }
  ],

  /* ---------- Team 2026–27 ----------
     Leadership → Core Team → Board of Directors.
     photo = file name in assets/team (without .jpg); null shows initials. */
  core: [
    { name: "Rtr. Misaal Thakker", role: "President", photo: "misaal-thakker" },
    { name: "Rtn. Rtr. Harsh Kumawat", role: "Immediate Past President", photo: "harsh-kumawat" },
    { name: "Rtr. Manaswi Mishra", role: "Secretary", photo: "manaswi-mishra" },
    { name: "Rtr. Shailendra Mishra", role: "Vice President", photo: "shailendra-mishra" },
    { name: "Rtr. Urja Khakhar", role: "Vice President", photo: "urja-khakhar" },
    { name: "Rtr. Neelangi Mehta", role: "Joint Secretary", photo: "neelangi-mehta" },
    { name: "Rtr. Dhruvi Satia", role: "Treasurer", photo: "dhruvi-satia" },
    { name: "Rtr. Khooshi Vora", role: "HRD Officer", photo: "khooshi-vora" },
    { name: "Rtr. Hetansh Mehta", role: "Sergeant-at-Arms", photo: "hetansh-mehta" },
    { name: "Rtr. Love Khakhar", role: "Club Mentor & Advisor", photo: "love-khakhar" }
  ],

  bod: [
    { name: "Rtr. Vijay Verma", role: "Club Service Director", avenue: "fellowship", photo: "vijay-verma" },
    { name: "Rtr. Soham Rathi", role: "Club Service Director", avenue: "fellowship", photo: "soham-rathi" },
    { name: "Rtr. Dhruvi Satia", role: "Community Service Director", avenue: "community", photo: "dhruvi-satia" },
    { name: "Rtr. Anurag Nirgun", role: "Community Service Director", avenue: "community", photo: "anurag-nirgun" },
    { name: "Rtr. Dhruv Singh", role: "Professional & Entrepreneurship Development Director", avenue: "professional", photo: "dhruv-singh" },
    { name: "Rtr. Sanika Kadam", role: "Professional & Entrepreneurship Development Director", avenue: "professional", photo: "sanika-kadam" },
    { name: "Rtr. Khooshi Vora", role: "International Service Director", avenue: "international", photo: "khooshi-vora" },
    { name: "Rtr. Neelangi Mehta", role: "International Service Director", avenue: "international", photo: "neelangi-mehta" },
    { name: "Rtr. Naitik Vora", role: "PR & Marketing Director", avenue: "pr", photo: null },
    { name: "Rtr. Shraddha Nagrani", role: "Digital Media Director", avenue: "digital", photo: "shraddha-nagrani" },
    { name: "Rtr. Aayush Dubey", role: "Digital Media Director", avenue: "digital", photo: "aayush-dubey" },
    { name: "Rtr. Suhani Chavda", role: "Editorials Director", avenue: "digital", photo: "suhani-chavda" },
    { name: "Rtr. Jay Rathod", role: "Partners-in-Service Director", avenue: "partners", photo: "jay-rathod" }
  ],

  /* Board groups shown on the Team section (in this order) */
  bodGroups: [
    { label: "Club Service", avenue: "fellowship" },
    { label: "Community Service", avenue: "community" },
    { label: "Professional & Entrepreneurship Development", avenue: "professional" },
    { label: "International Service", avenue: "international" },
    { label: "PR & Marketing", avenue: "pr" },
    { label: "Digital Media & Editorials", avenue: "digital" },
    { label: "Partners in Service", avenue: "partners" }
  ],

  guidance: [
    { name: "Rtn. Prakash Kamthe", role: "President, Rotary Club of Mumbai Dahisar" },
    { name: "Rtr. PHF Shree Hari Nair", role: "District Rotaract Representative, RID 3141" },
    { name: "Rtr. Amar Singh", role: "Zonal Rotaract Representative, Zone 2" },
    { name: "Rtr. Ambresh Shukla", role: "Zonal Rotaract Representative, Zone 2" }
  ],

  /* ---------- Hall of Fame · Past Presidents ---------- */
  pastPresidents: [
    { n: 1, name: "Rtr. Prakash Joshi" },
    { n: 2, name: "Rtr. Akshay Khurmurkar" },
    { n: 3, name: "Rtr. Sachin Thakoor" },
    { n: 4, name: "Rtr. Shilpa Gaikwad" },
    { n: 5, name: "Rtr. Chinmay Dalal" },
    { n: 6, name: "Rtr. Rajesh Namibiar" },
    { n: 7, name: "Rtr. Makrand Kaprekar" },
    { n: 8, name: "Rtr. Biting Thakoor" },
    { n: 9, name: "Rtr. Abhishek Chandra" },
    { n: 10, name: "Rtr. Nirav Vasa", year: "2001–02" },
    { n: 11, name: "Rtr. Dharmendra Gangrade", year: "2002–03" },
    { n: 12, name: "Rtr. Harshil Shah", year: "2003–04" },
    { n: 13, name: "Rtr. Devang Patel", year: "2004–05" },
    { n: 14, name: "Rtr. Vikas Purandare", year: "2005–06" },
    { n: 15, name: "Rtr. Devang Patel", year: "2006–07" },
    { n: 16, name: "Rtr. Ankit Nanavati", year: "2007–08" },
    { n: 17, name: "Rtr. Khusal Vora", year: "2008–09" },
    { n: 18, name: "Rtr. Chetan Joshi", year: "2009–10" },
    { n: 19, name: "Rtr. Mayank Shah", year: "2010–11" },
    { n: 20, name: "Rtr. Rishabh Ojha", year: "2011–12" },
    { n: 21, name: "Rtr. Akshay Vaishnav", year: "2012–13" },
    { n: 22, name: "Rtr. Tanvi Ladha", year: "2013–14" },
    { n: 23, name: "Rtr. Dhaval Vora", year: "2014–15" },
    { n: 24, name: "Rtr. Jui Prabhu", year: "2015–16" },
    { n: 25, name: "Rtr. Ketul Raghani", year: "2016–17" },
    { n: 26, name: "Rtr. Ketul Raghani", year: "2017–18" },
    { n: 27, name: "Rtr. Manasi Patani", year: "2018–19" },
    { n: 28, name: "Rtr. Krishna Panchal", year: "2019–20" },
    { n: 29, name: "Rtr. Harsh Vaishnav", year: "2020–21" },
    { n: 30, name: "Rtr. Rajas Panandikar", year: "2021–22" },
    { n: 31, name: "Rtr. Priyesh Butani", year: "2022–23" },
    { n: 32, name: "Rtr. Biplab Maity", year: "2023–24" },
    { n: 33, name: "Rtr. Mitti Doshi", year: "2024–25" },
    { n: 34, name: "Rtr. Harsh Kumawat", year: "2025–26" },
    { n: 35, name: "Rtr. Misaal Thakker", year: "2026–27", current: true }
  ],

  eras: [
    { title: "The founding years", sub: "Where it all began", from: 1, to: 9 },
    { title: "The 2000s", sub: "2001 – 2010", from: 10, to: 18 },
    { title: "The 2010s", sub: "2010 – 2020", from: 19, to: 28 },
    { title: "The 2020s", sub: "2020 – now", from: 29, to: 35 }
  ],

  /* ---------- Instagram reels (IDs from the reel links) ---------- */
  reels: ["DdymC56q8eu", "DdN_npXK7Ru", "Da8Xbbjqq2q", "DUAdmKFijgR", "DN8Qu_fk4Hv"],

  /* ---------- Events calendar (RIY 2026–27) ----------
     Status (done / upcoming) is calculated automatically from
     today's date, so you never need to update it by hand.     */
  events: [
    { date: "2026-07-03", name: "Beyond the Boardroom" },
    { date: "2026-07-04", name: "Beyond the Boardroom" },
    { date: "2026-07-05", name: "GBM" },
    { date: "2026-07-07", name: "Around the World in Cocoa" },
    { date: "2026-07-08", name: "Bombay Ki Baarish" },
    { date: "2026-07-09", name: "Bombay Ki Baarish" },
    { date: "2026-07-11", name: "District Assembly / Population Day Awareness" },
    { date: "2026-07-12", name: "Guess the Friend" },
    { date: "2026-07-19", name: "Installation Ceremony (Acensus)" },
    { date: "2026-07-28", name: "Plant a Tree for Future" },
    { date: "2026-07-31", name: "Paper Boat" },
    { date: "2026-08-02", name: "Yaaro ki Mehfil" },
    { date: "2026-08-15", name: "Independence Day / Prompt to Pitch / Annapurna / Good Old Days" },
    { date: "2026-08-16", name: "Prompt to Pitch" },
    { date: "2026-08-17", name: "Prompt to Pitch" },
    { date: "2026-08-18", name: "Prompt to Pitch" },
    { date: "2026-08-19", name: "Prompt to Pitch" },
    { date: "2026-08-20", name: "Prompt to Pitch" },
    { date: "2026-08-23", name: "Safar: District Trek" },
    { date: "2026-09-03", name: "Janmashtami Campaign" },
    { date: "2026-09-04", name: "Janmashtami Campaign" },
    { date: "2026-09-06", name: "GBM / Dhara: Seed Ball Plantation" },
    { date: "2026-09-14", name: "Om Morya Re" },
    { date: "2026-09-15", name: "Om Morya Re" },
    { date: "2026-09-17", name: "BOD Meeting: Bylaws" },
    { date: "2026-09-20", name: "Ganpati with Grace 2.0" },
    { date: "2026-10-04", name: "GBM" },
    { date: "2026-11-01", name: "GBM" },
    { date: "2026-12-06", name: "GBM" },
    { date: "2027-01-03", name: "GBM" },
    { date: "2027-02-07", name: "GBM" },
    { date: "2027-03-07", name: "GBM" },
    { date: "2027-04-04", name: "GBM" },
    { date: "2027-05-02", name: "GBM" },
    { date: "2027-06-06", name: "GBM" }
  ],

  /* ---------- Rotary family ---------- */
  rotary: {
    global: {
      title: "Rotary International",
      facts: [["Founded", "1905, Chicago"], ["Founder", "Paul Harris"], ["Members", "1.2 million+"], ["HQ", "Evanston, Illinois"], ["President 2026–27", "Olayinka H. Babalola"]],
      body: [
        "Rotary International is a global network of volunteers who take action in their communities and around the world. Paul Harris started it in Chicago in 1905 so professionals from different fields could build lasting friendships and give back. Today Rotary has clubs in nearly every country.",
        "Its mission is to provide service to others, promote integrity, and advance world understanding, goodwill, and peace. The work is organised around seven areas of focus: peacebuilding and conflict prevention; disease prevention and treatment; water and sanitation; maternal and child health; basic education and literacy; community economic development; and the environment.",
        "The Rotary Foundation is Rotary's charitable arm, funding everything from local projects to large global grants. Rotary has led the fight to end polio since 1985, and India was certified polio-free in 2014.",
        "RI President 2026–27: Olayinka Hakeem Babalola of the Rotary Club of Trans Amadi, Port Harcourt, Nigeria. He is the second African president in Rotary's history and the first RI president whose Rotary journey began in Rotaract. His theme for the year is “Create Lasting Impact.”"
      ]
    },
    district: {
      title: "RI District 3141",
      facts: [["Region", "Mumbai"], ["Our zone", "Zone 2"], ["Term", "1 July – 30 June"], ["DRR 2026–27", "Rtr. PHF Shree Hari Nair"]],
      body: [
        "Rotary clubs are grouped into districts, each led by a District Governor who serves a one-year term from 1 July to 30 June. RID 3141 covers Mumbai and is one of the most active districts in India, home to a large network of Rotary and Rotaract clubs working across community service, health, education and professional development.",
        "On the Rotaract side, the district is led by the District Rotaract Representative (DRR), supported by Zonal Rotaract Representatives (ZRRs) who look after clubs zone by zone.",
        "2026–27: DRR Rtr. PHF Shree Hari Nair. Zone 2, which includes RCDC, is guided by ZRRs Rtr. Amar Singh and Rtr. Ambresh Shukla."
      ]
    },
    partnership: {
      title: "Rotary & Rotaract",
      facts: [["Rotaract born", "13 March 1968"], ["Clubs worldwide", "~9,000"], ["Members", "~120,000"], ["Our sponsor", "Rotary Club of Mumbai Dahisar"]],
      body: [
        "Rotaract began in 1968 with the first club chartered through the Charlotte North Rotary Club in North Carolina, USA. It started as a Rotary youth programme and has grown into a global movement across more than 180 countries.",
        "The relationship between a Rotaract club and its sponsoring Rotary club is a partnership, not a hierarchy. The Rotary club mentors, guides and serves alongside the Rotaract club, while Rotaractors run their own club, manage their own funds and plan their own projects. Rotaractors are encouraged to join a Rotary club too and can hold both memberships at once, which is where the title “Rtn. Rtr.” comes from.",
        "RCDC is sponsored by the Rotary Club of Mumbai Dahisar, led in 2026–27 by Rotary President Rtn. Prakash Kamthe."
      ],
      timeline: [
        ["1968", "First Rotaract club chartered in Charlotte, USA."],
        ["2019", "Rotary's Council on Legislation makes Rotaract a membership type of Rotary International. Rotaractors are now part of Rotary itself."],
        ["2020", "1 July: upper age limit removed; anyone 18 or older can join. Clubs can charter with or without a sponsor, and Rotaract clubs can sponsor other Rotaract clubs."],
        ["2022", "1 July: Rotaract clubs pay annual RI dues, the chartering fee is dropped, and eligible clubs can sponsor global grants."]
      ]
    }
  }
};
