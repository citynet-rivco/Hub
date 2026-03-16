const D = Date.now(), PD = 86400000;
const jobs = {
  "Murrieta":[
    {title:"Client Engagement Specialist",employer:"The Grey Legal Group",wage:"$23.00/hr",type:"ft",url:"https://www.indeed.com/jobs?q=Client+Engagement+Specialist+Grey+Legal+Group&l=Murrieta%2C+CA",posted:new Date(D-2*PD).toISOString(),status:"open", source:"Indeed"},
    {title:"Welcome Team Coordinator",employer:"Shoup Legal",wage:"$21.00/hr",type:"ft",url:"https://www.linkedin.com/jobs/search/?keywords=Welcome+Team+Coordinator+Shoup+Legal",posted:new Date(D-5*PD).toISOString(),status:"open", source:"LinkedIn"},
    {title:"Tire and Battery Service Advisor",employer:"Sam's Club",wage:"$19.00/hr",type:"ft",url:"https://www.indeed.com/jobs?q=Tire+Battery+Service+Advisor+Sams+Club&l=Murrieta%2C+CA",posted:new Date(D-16*PD).toISOString(),status:"open", source:"Indeed"}, // Filtered out (> 14 days)
    {title:"Cashier",employer:"Panera Bread",wage:"$20.00/hr",type:"ft",url:"https://www.indeed.com/jobs?q=Cashier+Panera+Bread&l=Murrieta%2C+CA",posted:new Date(D-0.5*PD).toISOString(),status:"closed", source:"Indeed"}, // Filtered out (Closed)
    {title:"Corporate Trainer",employer:"Tech Solutions",wage:"$28.00/hr",type:"ft",url:"https://www.linkedin.com/jobs/search/?keywords=Corporate+Trainer+Tech+Solutions",posted:new Date(D-1*PD).toISOString(),status:"open", source:"LinkedIn"},
    {title:"Security Specialist",employer:"Target",wage:"$20.50/hr",type:"pt",url:"https://www.indeed.com/jobs?q=Security+Specialist+Target&l=Murrieta%2C+CA",posted:new Date(D-1*PD).toISOString(),status:"open", source:"Indeed"},
    {title:"Specialty Sales",employer:"Target",wage:"$18.25/hr",type:"pt",url:"https://www.indeed.com/jobs?q=Specialty+Sales+Target&l=Murrieta%2C+CA",posted:new Date(D-4*PD).toISOString(),status:"open", source:"Indeed"},
    {title:"Customer Service",employer:"KFC",wage:"$20.00/hr",type:"pt",url:"https://www.indeed.com/jobs?q=Customer+Service+KFC&l=Murrieta%2C+CA",posted:new Date(D-12*PD).toISOString(),status:"open", source:"Indeed"},
  ],
  "Wildomar":[
    {title:"Membership Sales Associate",employer:"Super Star Car Wash",wage:"$18.50/hr",type:"pt",url:"https://www.indeed.com/jobs?q=Membership+Sales+Associate+Super+Star+Car+Wash&l=Wildomar%2C+CA",posted:new Date(D-3*PD).toISOString(),status:"open", source:"Indeed"},
    {title:"Restaurant Crew",employer:"Dunkin'",wage:"$20.00/hr",type:"pt",url:"https://www.indeed.com/jobs?q=Restaurant+Crew+Dunkin&l=Wildomar%2C+CA",posted:new Date(D-7*PD).toISOString(),status:"open", source:"Indeed"},
    {title:"Store Manager",employer:"AutoZone",wage:"$24.00/hr",type:"ft",url:"https://www.linkedin.com/jobs/search/?keywords=Store+Manager+AutoZone",posted:new Date(D-15*PD).toISOString(),status:"open", source:"LinkedIn"}, // Filtered out (> 14 days)
  ],
  "Menifee":[
    {title:"Seasonal Retail Sales Associate",employer:"Lowe's",wage:"$16.90/hr",type:"ft",url:"https://www.indeed.com/jobs?q=Seasonal+Retail+Sales+Associate+Lowes&l=Menifee%2C+CA",posted:new Date(D-1.5*PD).toISOString(),status:"open", source:"Indeed"},
    {title:"Front Desk Sales Associate",employer:"Massage Envy",wage:"$16.50/hr",type:"ft",url:"https://www.indeed.com/jobs?q=Front+Desk+Sales+Associate+Massage+Envy&l=Menifee%2C+CA",posted:new Date(D-10*PD).toISOString(),status:"open", source:"Indeed"},
    {title:"Barista",employer:"Better Buzz Coffee",wage:"$21.00/hr",type:"pt",url:"https://www.indeed.com/jobs?q=Barista+Better+Buzz+Coffee&l=Menifee%2C+CA",posted:new Date(D-0.8*PD).toISOString(),status:"open", source:"Indeed"},
    {title:"CDL A Truck Driver",employer:"Updike Distribution Logistics",wage:"$15.50/hr",type:"pt",url:"https://www.indeed.com/jobs?q=CDL+A+Truck+Driver+Updike+Distribution+Logistics&l=Menifee%2C+CA",posted:new Date(D-5*PD).toISOString(),status:"open", source:"Indeed"},
    {title:"Logistics Coordinator",employer:"Amazon",wage:"$22.00/hr",type:"ft",url:"https://www.linkedin.com/jobs/search/?keywords=Logistics+Coordinator+Amazon",posted:new Date(D-2*PD).toISOString(),status:"open", source:"LinkedIn"},
  ],
  "Lake Elsinore":[
    {title:"Service Team",employer:"Panda Express",wage:"$21.00/hr",type:"ft",url:"https://www.indeed.com/jobs?q=Service+Team+Panda+Express&l=Lake+Elsinore%2C+CA",posted:new Date(D-4*PD).toISOString(),status:"open", source:"Indeed"},
    {title:"Receptionist",employer:"H&R Block",wage:"$16.50/hr",type:"ft",url:"https://www.indeed.com/jobs?q=Receptionist+HR+Block&l=Lake+Elsinore%2C+CA",posted:new Date(D-0.4*PD).toISOString(),status:"open", source:"Indeed"},
    {title:"Guest Advocate",employer:"Target",wage:"$18.25/hr",type:"pt",url:"https://www.indeed.com/jobs?q=Guest+Advocate+Target&l=Lake+Elsinore%2C+CA",posted:new Date(D-9*PD).toISOString(),status:"open", source:"Indeed"},
    {title:"Customer Service Representative",employer:"Chevron",wage:"$18.25/hr",type:"pt",url:"https://www.indeed.com/jobs?q=Customer+Service+Representative+Chevron&l=Lake+Elsinore%2C+CA",posted:new Date(D-11*PD).toISOString(),status:"closed", source:"Indeed"}, // Filtered out (Closed)
    {title:"Marketing Assistant",employer:"Local Agency",wage:"$20.00/hr",type:"pt",url:"https://www.linkedin.com/jobs/search/?keywords=Marketing+Assistant",posted:new Date(D-3*PD).toISOString(),status:"open", source:"LinkedIn"},
  ],
  "Temecula":[
    {title:"HR Support Services Assistant",employer:"Southwest Healthcare",wage:"$24.99/hr",type:"ft",url:"https://www.indeed.com/jobs?q=HR+Support+Services+Assistant+Southwest+Healthcare&l=Temecula%2C+CA",posted:new Date(D-1*PD).toISOString(),status:"open", source:"Indeed"},
    {title:"Roofing Laborer",employer:"Westmax Roofing",wage:"$25.00/hr",type:"ft",url:"https://www.indeed.com/jobs?q=Roofing+Laborer+Westmax+Roofing&l=Temecula%2C+CA",posted:new Date(D-4*PD).toISOString(),status:"open", source:"Indeed"},
    {title:"Cook",employer:"Buffalo Wild Wings",wage:"$18.00/hr",type:"ft",url:"https://www.indeed.com/jobs?q=Cook+Buffalo+Wild+Wings&l=Temecula%2C+CA",posted:new Date(D-6*PD).toISOString(),status:"open", source:"Indeed"},
    {title:"Shift Leader",employer:"Panda Express",wage:"$23.00/hr",type:"ft",url:"https://www.indeed.com/jobs?q=Shift+Leader+Panda+Express&l=Temecula%2C+CA",posted:new Date(D-13*PD).toISOString(),status:"open", source:"Indeed"},
    {title:"Retail Customer Service Associate",employer:"FedEx",wage:"$19.70/hr",type:"pt",url:"https://www.indeed.com/jobs?q=Retail+Customer+Service+Associate+FedEx&l=Temecula%2C+CA",posted:new Date(D-8*PD).toISOString(),status:"open", source:"Indeed"},
    {title:"Software Engineer I",employer:"TechStart",wage:"$45.00/hr",type:"ft",url:"https://www.linkedin.com/jobs/search/?keywords=Software+Engineer+I+TechStart",posted:new Date(D-2*PD).toISOString(),status:"open", source:"LinkedIn"},
  ],
};

const staffingAgencies = [
  {name:"PrideStaff", phone:"951-999-4230", email:"southriversidecounty@pridestaff.com", website:"https://www.pridestaff.com/locations/southriversidecounty/", address:"25186 Hancock Avenue, Suite 320, Murrieta, CA", special:"Staffing Agency"},
  {name:"PeopleReady", phone:"951-587-2027", email:"1523-br@peopleready.com", website:"https://www.peopleready.com/location/murrieta-ca-1523/", address:"25014 Las Brisas South, Suite A, Murrieta CA", special:"Staffing Agency"},
  {name:"Partners Personnel", phone:"951-691-1008", website:"https://www.partnerspersonnel.com/", address:"39040, 105 Sky Canyon Drive, B5, Murrieta, CA", special:"Staffing Agency"},
  {name:"Manpower Riverside", phone:"951-308-2686", website:"https://www.manpowerriverside.com/temecula/", address:"39885 Alta Murrieta Drive, D1, Murrieta, CA", special:"Staffing Agency"},
  {name:"AtWork Personnel", phone:"951-297-3591", email:"temecula@atwork.com", website:"https://www.atwork.com/locations/temecula/", address:"27720 Jefferson Ave, Suite 130, Temecula, CA", special:"Staffing Agency"},
  {name:"United Staffing Associates", phone:"951-228-2221", website:"https://www.unitedwestaff.com/locations/wildomar-ca", address:"32326 Clinton Keith Road, Suite 105, Wildomar, CA", special:"Staffing Agency"},
  {name:"Infinium Staffing", phone:"951-816-6434", email:"info@infiniumhr.com", website:"https://www.infiniumstaffing.com/", address:"29970 Technology Drive, Suite 223, Murrieta, CA", special:"Staffing Agency"},
  {name:"Apple One Employment Services", phone:"951-296-5430", email:"temecula-ca@appleone.com", website:"https://www.appleone.com/", address:"41923 Second Street, Suite 202, Temecula, CA", special:"Staffing Agency"},
  {name:"iStaff Pros, Inc.", phone:"951-200-5523", email:"info@istaffpros.com", website:"https://istaffpros.com/", address:"27412 Enterprise Circle West, Suite 201, Temecula, CA", special:"Staffing Agency"},
  {name:"Spherion Staffing & Recruiting", phone:"760-568-3433", website:"https://www.spherion.com/", address:"41593 Winchester Road, Suite 200, Temecula, CA", special:"Staffing Agency"},
  {name:"OneCruit LLC", phone:"951-566-4100", email:"menifeebranch@onecruit.com", website:"https://www.onecruit.com/menifee", address:"27701 Scott Road, Unit 302, Menifee, CA", special:"Staffing Agency"},
  {name:"Go Staff", phone:"951-760-7100", website:"https://go-staff.com/contact-go-staff/labor-skilled-trades-and-office-division/", address:"41790 Winchester Road, Temecula, CA", special:"Staffing Agency"},
  {name:"Express Employment Professionals", phone:"951-877-4623", website:"https://www.expresspros.com/us-california-temecula", address:"27555 Ynez Road, Suite 202, Temecula, CA", special:"Staffing Agency"},
  {name:"TechBridge Global Services", phone:"858-203-6313", email:"info@techbridgegs.com", website:"https://techbridgegs.com/", special:"Staffing Agency"},
  {name:"Blue Horizon Staffing Solutions", phone:"866-728-1346", email:"Staff@Bluehorizonstaffing.com", address:"41593 Winchester Road, Suite 200-242, Temecula, CA", special:"Staffing Agency"},
  {name:"Honestlove Global", phone:"951-763-6005", email:"contact@honestloveglobalstaffing.com", website:"https://honestloveglobalprofessionals.com/", address:"29970 Technology Drive, Murrieta, CA", special:"Healthcare Staffing"},
  {name:"Staffmark", phone:"951-928-5351", website:"https://staffmark.com/locations/perri-ca/", address:"3150 Case Road, Suite O-3, Perris, CA", special:"Staffing Agency"}
];
