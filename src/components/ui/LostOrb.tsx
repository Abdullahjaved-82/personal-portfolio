import Spline from '@splinetool/react-spline/next';

export default function LostOrb() {
  return (
    <div className='w-full h-full opacity-70 pointer-events-none' style={{ 
      filter: 'saturate(1.3) brightness(1.1)',
      mixBlendMode: 'screen'
    }}>
      <Spline
        scene="https://prod.spline.design/kVbOOfwISRC36KJd/scene.splinecode"
      />
    </div>
  );
}
