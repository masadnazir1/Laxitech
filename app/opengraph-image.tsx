import { ImageResponse } from 'next/og';

export const alt = 'Laxitech — Your business. Better engineered.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '58px 64px', background: '#0c0d10', color: '#f4f5f7', fontFamily: 'sans-serif' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 30 }}><span style={{ fontWeight: 700 }}>Laxitech</span><span style={{ color: '#9ca6b9', fontSize: 22 }}>Software · Cloud · Engineering</span></div><div style={{ display: 'flex', flexDirection: 'column', marginTop: 90, fontSize: 94, lineHeight: 1.04, letterSpacing: '-5px', fontWeight: 700 }}><span>Your business.</span><span>Better engineered.</span></div><div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', fontSize: 23, color: '#aeb6c6' }}><span>From the first idea to your next chapter.</span><span>laxitech.com</span></div></div>, size);
}
