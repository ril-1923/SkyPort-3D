export const AIRLINES=['SKYWAYS','GLOBAL AIR','OCEANIC','AERO INDIA','SKYLINE AIR'];
export const AIRLINE_COLORS=[0x1e88e5,0xe53935,0x00897b,0xff9933,0x7e57c2];
export const GATES=[['A01',-30],['A02',-18],['A03',-6],['B01',6],['B02',18],['B03',30]].map(([id,x])=>({id,x}));
export const DESTS=['Mumbai','Delhi','Dubai','Singapore','London','Tokyo','Paris','Sydney','Doha','Bangkok'];
export const FLIGHTS0=[
 {no:'SK101',dest:'Mumbai',gate:'A01',status:'BOARDING'},{no:'SK204',dest:'Delhi',gate:'A02',status:'ON TIME'},
 {no:'SK512',dest:'London',gate:'A03',status:'BOARDING'},{no:'SK305',dest:'Dubai',gate:'B01',status:'DELAYED'},
 {no:'SK410',dest:'Singapore',gate:'B02',status:'ON TIME'},{no:'SK618',dest:'Tokyo',gate:'B03',status:'ON TIME'}];
export const STATUS_COLORS={BOARDING:'#35e07a','ON TIME':'#ffc247',DELAYED:'#ff5a5a',DEPARTED:'#7aa7c7',LANDED:'#ffc247','ON BELT':'#35e07a',EXPECTED:'#6fb5ff'};
export const SHOPS=[
 {name:'AROMA CAFÉ',kind:'Café',hours:'05:00 – 23:00',desc:'Single-origin coffee, pastries and light meals.',color:0x8b5a2b},
 {name:'DUTY FREE',kind:'Duty-free store',hours:'24 hours',desc:'Perfume, spirits, chocolate and travel essentials.',color:0x6a4c93},
 {name:'PAGE TURNER',kind:'Bookstore',hours:'06:00 – 22:00',desc:'Bestsellers, magazines and travel guides.',color:0x2a7f62},
 {name:'TECH HUB',kind:'Electronics',hours:'06:00 – 22:00',desc:'Headphones, chargers and adapters.',color:0x2b6cb0},
 {name:'SKY BITES',kind:'Café & Grill',hours:'05:30 – 00:00',desc:'Fast casual meals, sandwiches and fresh juices.',color:0xc0392b}];
export const NAMES=['Aarav Mehta','Sofia Rossi','Liam Chen','Priya Nair','Noah Walker','Yuki Tanaka','Amira Khan','Lucas Silva','Emma Dubois','Rohan Iyer','Olivia Brown','Kenji Sato','Fatima Noor','Ethan Clark','Ananya Rao','Mateo Garcia','Chloe Martin','Arjun Das','Hana Kim','Oscar Berg','Zara Ali','Diego Torres','Meera Pillai','Jonas Weber','Isla Scott','Vikram Singh','Lena Fischer','Omar Haddad'];
export const NATIONS=['India','Italy','China','UK','USA','Japan','UAE','Brazil','France','Germany','Australia','Singapore'];
