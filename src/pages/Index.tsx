import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// SVG paths from igdtu_hack
const svgPaths = {
  p14909400: "M5.46 10.5133V8.00667L0 4.74L5.46 1.48V0L0 3.26667V6.22L5.46 9.48V10.5133ZM7.31 0V1.48L12.77 4.74L7.31 8.00667V10.5133L12.77 7.24667V4.28L7.31 1.02V0Z",
  p1db16500: "M19.635 13.5067V0.866669H18.0817V8.61333L11.8083 0.866669H10.255V13.5067H11.8083V5.75333L18.0883 13.5067H19.635Z",
  p2c886580: "M26.8367 14C29.4967 14 31.6567 11.8067 31.6567 9.18667C31.6567 6.56 29.4967 4.37333 26.8367 4.37333C24.17 4.37333 21.9967 6.56 21.9967 9.18667C21.9967 11.8067 24.17 14 26.8367 14ZM26.8367 12.5067C24.9833 12.5067 23.55 11.0133 23.55 9.18667C23.55 7.35333 24.9833 5.86667 26.8367 5.86667C28.6833 5.86667 30.1033 7.35333 30.1033 9.18667C30.1033 11.0133 28.6833 12.5067 26.8367 12.5067Z",
  p23ec6c40: "M38.7283 14C40.5217 14 41.9883 13.2067 42.8017 11.94L41.5017 11.0333C40.9683 11.9 39.9417 12.5067 38.7217 12.5067C36.8617 12.5067 35.4483 11.02 35.4483 9.18667C35.4483 7.35333 36.8617 5.86667 38.7217 5.86667C39.9417 5.86667 40.9683 6.47333 41.5017 7.34L42.8017 6.43333C41.9883 5.16667 40.5217 4.37333 38.7283 4.37333C36.075 4.37333 33.8817 6.56 33.8817 9.18667C33.8817 11.8067 36.075 14 38.7283 14Z",
  p110f4300: "M46.8317 13.5067V0.866669H45.2783V13.5067H46.8317Z",
  p208fbd70: "M57.2917 8.07333H51.1783V9.56667H57.2917V8.07333ZM54.235 4.86667V13.5067H55.7883V4.86667H59.8517V0.866669H49.7017V4.86667H54.235ZM51.255 0.866669V3.37333H58.2983V0.866669H51.255Z",
  pface480: "M68.1383 13.5067V10.5133L62.6783 7.24667V4.28L68.1383 1.02V0L62.6783 3.26667V6.22L68.1383 9.48V13.5067ZM69.995 13.5067V9.48L75.455 6.22V3.26667L69.995 0V1.02L75.455 4.28V7.24667L69.995 10.5133V13.5067Z",
  p13e98800: "M82.2183 13.5067V5.33333H87.3583V3.84H82.2183V0.866669H80.665V13.5067H82.2183Z",
  p61d8f00: "M90.5617 13.5067V0.866669H89.0083V13.5067H90.5617Z",
  p245fb200: "M98.3483 13.5067V8.61333L103.648 13.5067H105.675V0.866669H104.122V5.75333L98.8217 0.866669H96.795V13.5067H98.3483Z",
  p30693480: "M114.125 13.5067H115.865L112.685 4.86667H110.878L107.705 13.5067H109.445L110.132 11.68H113.438L114.125 13.5067ZM111.785 6.04L113.032 10.1867H110.538L111.785 6.04Z",
  p379f39f2: "M123.348 13.5067V8.61333L128.648 13.5067H130.675V0.866669H129.122V5.75333L123.822 0.866669H121.795V13.5067H123.348Z",
  p25a58e00: "M138.765 14C141.425 14 143.585 11.8067 143.585 9.18667C143.585 6.56 141.425 4.37333 138.765 4.37333C136.098 4.37333 133.925 6.56 133.925 9.18667C133.925 11.8067 136.098 14 138.765 14ZM138.765 12.5067C136.912 12.5067 135.478 11.0133 135.478 9.18667C135.478 7.35333 136.912 5.86667 138.765 5.86667C140.612 5.86667 142.032 7.35333 142.032 9.18667C142.032 11.0133 140.612 12.5067 138.765 12.5067ZM150.657 13.5067V5.33333H155.797V3.84H150.657V0.866669H149.103V13.5067H150.657ZM164.115 13.5067V5.33333H169.255V3.84H164.115V0.866669H162.562V13.5067H164.115Z",
  p33852600: "M7.21333 13.88V10.5733L0 6.26L7.21333 1.95333V0L0 4.31333V8.21333L7.21333 12.5267V13.88ZM9.65333 0V1.95333L16.8667 6.26L9.65333 10.5733V13.88L16.8667 9.56667V5.66667L9.65333 1.35333V0Z",
  p1d376800: "M25.9267 17.84V1.14667H23.9067V11.38L15.6067 1.14667H13.5533V17.84H15.5733V7.59333L23.8867 17.84H25.9267Z",
  p3c337280: "M35.44 18.4733C39.32 18.4733 41.8933 15.66 41.8933 12.1267C41.8933 8.57333 39.32 5.78 35.44 5.78C31.54 5.78 28.9533 8.57333 28.9533 12.1267C28.9533 15.66 31.54 18.4733 35.44 18.4733ZM35.44 16.5267C32.9133 16.5267 30.9733 14.54 30.9733 12.1267C30.9733 9.70667 32.9133 7.72667 35.44 7.72667C37.9533 7.72667 39.8733 9.70667 39.8733 12.1267C39.8733 14.54 37.9533 16.5267 35.44 16.5267Z",
  p21395380: "M51.1533 18.4733C53.5867 18.4733 55.4933 17.4333 56.58 15.7667L54.8067 14.5667C54.1133 15.7 52.7667 16.5267 51.1467 16.5267C48.6067 16.5267 46.8333 14.5533 46.8333 12.1267C46.8333 9.70667 48.6067 7.72667 51.1467 7.72667C52.7667 7.72667 54.1133 8.55333 54.8067 9.68667L56.58 8.48667C55.4933 6.82 53.5867 5.78 51.1533 5.78C47.28 5.78 44.8 8.57333 44.8 12.1267C44.8 15.66 47.28 18.4733 51.1533 18.4733Z",
  p24e07200: "M61.8067 17.84V1.14667H59.7867V17.84H61.8067Z",
  p1f390400: "M75.6067 10.6667H67.6667V12.62H75.6067V10.6667ZM71.6333 6.42667V17.84H73.6533V6.42667H79.0067V1.14667H65.6533V6.42667H71.6333ZM67.6733 1.14667V4.46667H77.0133V1.14667H67.6733Z",
  pd1e6200: "M90.0067 17.84V13.88L82.7933 9.56667V5.66667L90.0067 1.35333V0L82.7933 4.31333V8.21333L90.0067 12.5267V17.84ZM92.4467 17.84V12.5267L99.66 8.21333V4.31333L92.4467 0V1.35333L99.66 5.66667V9.56667L92.4467 13.88V17.84Z",
  pdff4900: "M108.607 17.84V7.04H115.527V5.08667H108.607V1.14667H106.587V17.84H108.607Z",
  p19768c80: "M119.607 17.84V1.14667H117.587V17.84H119.607Z",
  p313589f0: "M129.913 17.84V11.38L136.86 17.84H139.567V1.14667H137.547V7.59333L130.593 1.14667H127.893V17.84H129.913Z",
  p1f875c00: "M150.767 17.84H153.127L148.913 6.42667H146.4L142.207 17.84H144.567L145.473 15.4133H149.86L150.767 17.84ZM147.66 7.98L149.367 13.46H145.96L147.66 7.98Z",
  p2f0ac200: "M162.94 17.84V11.38L169.887 17.84H172.593V1.14667H170.573V7.59333L163.62 1.14667H160.92V17.84H162.94Z",
  p31a1ff00: "M183.32 18.4733C187.2 18.4733 189.773 15.66 189.773 12.1267C189.773 8.57333 187.2 5.78 183.32 5.78C179.42 5.78 176.833 8.57333 176.833 12.1267C176.833 15.66 179.42 18.4733 183.32 18.4733ZM183.32 16.5267C180.793 16.5267 178.853 14.54 178.853 12.1267C178.853 9.70667 180.793 7.72667 183.32 7.72667C185.833 7.72667 187.753 9.70667 187.753 12.1267C187.753 14.54 185.833 16.5267 183.32 16.5267ZM198.767 17.84V7.04H205.687V5.08667H198.767V1.14667H196.747V17.84H198.767ZM216.58 17.84V7.04H223.5V5.08667H216.58V1.14667H214.56V17.84H216.58Z"
};

function Logo() {
  return (
    <div className="flex items-center" data-name="Logo">
      <h1 className="font-['Work_Sans',sans-serif] font-bold text-white text-[24px] tracking-[-0.5px]">
        FinPilot
      </h1>
    </div>
  );
}

function ButtonOnDark({ onClick }: { onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white content-stretch flex items-center justify-center px-[16px] py-[14px] relative rounded-[51.575px] shrink-0 cursor-pointer hover:opacity-90 transition-opacity" 
      data-name="Button on dark"
    >
      <p className="font-['Work_Sans',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[14px] text-[#1a1a1a] tracking-[-0.54px]">Log In</p>
    </div>
  );
}

function NavLabels({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[20px] items-center justify-end min-h-px min-w-px relative" data-name="Nav labels">
      <p className="font-['Work_Sans',sans-serif] font-medium leading-[1.1] relative shrink-0 text-white text-[14px] tracking-[-0.54px]">Services</p>
      <ButtonOnDark onClick={onLogin} />
    </div>
  );
}

function Nav({ onLogin }: { onLogin: () => void }) {
  return (
    <nav className="bg-[#1a1a1a] h-[101px] relative shrink-0 w-full" data-name="Nav">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[40px] py-[32px] relative size-full">
          <Logo />
          <NavLabels onLogin={onLogin} />
        </div>
      </div>
    </nav>
  );
}

const Index = () => {
  const navigate = useNavigate();
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setViewport("desktop");
      } else if (width >= 800) {
        setViewport("tablet");
      } else {
        setViewport("mobile");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  if (viewport === "desktop") {
    return (
      <div className="bg-white content-stretch flex flex-col items-center relative size-full overflow-y-auto" data-name="Desktop">
        <Nav onLogin={handleLogin} />
        
        {/* Hero Section */}
        <header className="bg-[#a0f1bd] relative rounded-bl-[16px] rounded-br-[16px] shrink-0 w-full" data-name="Hero section">
          <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex flex-col items-center px-[40px] py-[100px] relative w-full">
              <div className="content-stretch flex gap-[80px] items-center max-w-[1500px] relative shrink-0 w-full" data-name="Content">
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[50px] items-start min-h-px min-w-px relative" data-name="Block">
                  <div className="content-stretch flex flex-col font-['Work_Sans',sans-serif] font-normal gap-[24px] items-start relative shrink-0 text-[#2e4f21] w-full whitespace-pre-wrap" data-name="Text">
                    <h1 className="block leading-none relative shrink-0 text-[80px] tracking-[-6.4px] w-full">Financial Clarity You Can Trust</h1>
                    <p className="leading-[1.1] relative shrink-0 text-[16px] tracking-[-0.72px] w-full">Trusted financial guidance for every stage of life and business</p>
                  </div>
                  <div 
                    onClick={handleLogin}
                    className="bg-[#2e4f21] content-stretch flex items-center justify-center p-[12px] relative rounded-[51.575px] shrink-0 cursor-pointer hover:opacity-90 transition-opacity" 
                    data-name="Button on dark"
                  >
                    <p className="font-['Work_Sans',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[12px] text-white tracking-[-0.54px]">Join Now</p>
                  </div>
                </div>
                <div className="h-[411.495px] relative shrink-0 w-[429.005px]" data-name="Image">
                  <img 
                    alt="Globe graphic" 
                    className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
                    src="/assets/30ca89838aacef8bff03e2f6795db2b153b180f7.png" 
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Intro Section */}
        <div className="max-w-[1500px] relative shrink-0 w-full" data-name="Intro section">
          <div className="flex flex-col items-center max-w-[inherit] size-full">
            <div className="content-stretch flex flex-col items-center max-w-[inherit] pb-[100px] pt-[120px] px-[40px] relative w-full">
              <div className="content-stretch flex flex-col gap-[28.036px] items-center justify-center relative shrink-0 w-full" data-name="Content">
                <h2 className="block font-['DM_Sans',sans-serif] font-medium leading-none relative shrink-0 text-[#2e4f21] text-[15px] tracking-[-0.3px]" style={{ fontVariationSettings: "'opsz' 14" }}>
                  Services
                </h2>
                <p className="font-['Work_Sans',sans-serif] font-normal leading-[1.05] relative shrink-0 text-[#2e4f21] text-[60px] text-center tracking-[-4.2px] w-[857.438px] whitespace-pre-wrap">
                  Let us handle the numbers, <br aria-hidden="true" />so you can handle your success.
                </p>
                <p className="font-['Work_Sans',sans-serif] font-normal leading-[1.1] min-w-full relative shrink-0 text-[#2e4f21] text-[16px] text-center tracking-[-0.72px] w-[min-content] whitespace-pre-wrap">
                  Serving individuals and small businesses
                </p>
                <div 
                  onClick={handleLogin}
                  className="bg-[#2e4f21] content-stretch flex items-center justify-center p-[12px] relative rounded-[51.575px] shrink-0 cursor-pointer hover:opacity-90 transition-opacity" 
                  data-name="Button on light"
                >
                  <p className="font-['Work_Sans',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[12px] text-white tracking-[-0.54px]">Get Started</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white max-w-[1600px] relative shrink-0 w-full pb-[120px] pt-[80px] px-[40px]">
          <div className="grid md:grid-cols-2 gap-[40px] max-w-[1200px] mx-auto">
            {/* Feature 1 */}
            <div className="flex gap-[60px] items-start">
              <div className="aspect-[460/333.8385009765625] flex-[1_0_0] min-h-px min-w-px relative">
                <img 
                  alt="Coins coming out of phone" 
                  className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
                  src="/assets/71c13e83b84b848166e568c0a1a4eb18f7978007.png" 
                />
              </div>
              <div className="content-stretch flex flex-col font-['Work_Sans',sans-serif] font-normal gap-[40px] items-start relative shrink-0 text-[#2e4f21] w-[436px] whitespace-pre-wrap">
                <h3 className="block leading-[1.05] relative shrink-0 text-[40px] tracking-[-1.8px] w-full">Real Time Aggregation of balances</h3>
                <p className="leading-[1.1] relative shrink-0 text-[16px] tracking-[-0.72px] w-full">From Income to Investments — See, Save, and Simplify in Real Time</p>
                <div className="bg-white content-stretch flex items-center justify-center p-[12px] relative rounded-[8px] shrink-0 border border-[#506349]/20">
                  <p className="font-['Work_Sans',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[#506349] text-[12px] tracking-[-0.54px]">Live Money</p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-[60px] items-start flex-row-reverse">
              <div className="aspect-[460/333.8385009765625] flex-[1_0_0] min-h-px min-w-px relative">
                <img 
                  alt="Chart visualization" 
                  className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
                  src="/assets/ab5a98df97ce5b1d0e5405ab0abaaaa5f623a046.png" 
                />
              </div>
              <div className="content-stretch flex flex-col font-['Work_Sans',sans-serif] font-normal gap-[40px] items-start relative shrink-0 text-[#2e4f21] w-[436px] whitespace-pre-wrap">
                <h3 className="block leading-[1.05] relative shrink-0 text-[40px] tracking-[-1.8px] w-full">AI-Powered Budget Predictions</h3>
                <p className="leading-[1.1] relative shrink-0 text-[16px] tracking-[-0.72px] w-full">Smart allocations based on the 50/30/20 rule, personalized to your lifestyle</p>
                <div className="bg-white content-stretch flex items-center justify-center p-[12px] relative rounded-[8px] shrink-0 border border-[#506349]/20">
                  <p className="font-['Work_Sans',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[#506349] text-[12px] tracking-[-0.54px]">Smart Planning</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white h-[475px] relative shrink-0 w-full">
          <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex gap-[20px] items-center px-[40px] py-[50px] relative size-full">
              <div className="bg-[#2e4f21] flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[20px]">
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex items-center justify-center p-[60px] relative size-full">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[40px] items-start justify-center min-h-px min-w-px relative">
                      <p className="font-['Work_Sans',sans-serif] font-normal leading-[1.05] min-w-full relative shrink-0 text-[40px] text-white tracking-[-1.8px] w-[min-content] whitespace-pre-wrap">
                        A custom built plan for you
                      </p>
                      <p className="font-['Work_Sans',sans-serif] font-normal leading-[1.1] min-w-full relative shrink-0 text-[16px] text-white tracking-[-0.72px] w-[min-content] whitespace-pre-wrap">
                        Tailored guidance that helps you build smarter money habits, maximize savings, and reach your financial goals.
                      </p>
                      <div 
                        onClick={handleLogin}
                        className="bg-white content-stretch flex items-center justify-center p-[12px] relative rounded-[51.575px] shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <p className="font-['Work_Sans',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[#2e4f21] text-[12px] tracking-[-0.54px]">Learn More</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[20px]">
                <img 
                  alt="Stacked wood sticks" 
                  className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" 
                  src="/assets/42f4a71db8e56bffdfe1475802f66400ab29a49b.png" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-[#f9f9f9] relative shrink-0 w-full">
          <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex flex-col items-center px-[120px] py-[160px] relative w-full">
              <div className="content-stretch flex flex-col gap-[60px] items-center max-w-[1500px] relative shrink-0 w-full">
                <p className="font-['Work_Sans',sans-serif] font-normal leading-[1.05] min-w-full relative shrink-0 text-[#2e4f21] text-[60px] text-center tracking-[-4.2px] w-[min-content] whitespace-pre-wrap">
                  We believe managing money should be simple, smart, and stress‑free. Get started with FinPilot today!
                </p>
                <div 
                  onClick={handleLogin}
                  className="bg-[#2e4f21] content-stretch flex items-center justify-center px-[30px] py-[24px] relative rounded-[88px] shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <p className="font-['DM_Sans',sans-serif] font-medium leading-none relative shrink-0 text-[15px] text-center text-white tracking-[-0.3px]" style={{ fontVariationSettings: "'opsz' 14" }}>
                    Get Started
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#2e4f21] h-[346px] relative shrink-0 w-full">
          <div className="overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex items-start justify-between px-[40px] py-[32px] relative size-full">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[236px] h-full items-start min-h-px min-w-px relative">
                <div className="relative shrink-0">
                  <h2 className="font-['Work_Sans',sans-serif] font-bold text-white text-[20px] tracking-[-0.5px]">
                    FinPilot
                  </h2>
                </div>
                <div className="font-['Work_Sans',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[#d5e4d0] text-[0px] text-[12px] tracking-[-0.54px] w-full whitespace-pre-wrap">
                  <p className="mb-0 text-white">Financial Clarity You Can Trust</p>
                  <p>Trusted financial guidance for every stage of life and business</p>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[232px] h-full items-start min-h-px min-w-px relative">
                <p className="font-['Work_Sans',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[#d5e4d0] text-[12px] tracking-[-0.54px] w-full whitespace-pre-wrap">
                  © 2025 All Rights Reserved
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Simplified tablet/mobile view with key content
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <nav className="bg-[#1a1a1a] p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Logo />
          <button 
            onClick={handleLogin}
            className="bg-white text-[#1a1a1a] px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Log In
          </button>
        </div>
      </nav>

      <main className="flex-1">
        <section className="bg-[#a0f1bd] p-8 md:p-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-normal text-[#2e4f21] mb-6 leading-tight">
              Financial Clarity You Can Trust
            </h1>
            <p className="text-lg text-[#2e4f21] mb-8">
              Trusted financial guidance for every stage of life and business
            </p>
            <button 
              onClick={handleLogin}
              className="bg-[#2e4f21] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Join Now
            </button>
          </div>
        </section>

        <section className="p-8 md:p-16 text-center">
          <h2 className="text-sm text-[#2e4f21] font-medium mb-4">Services</h2>
          <p className="text-3xl md:text-5xl font-normal text-[#2e4f21] mb-6 leading-tight max-w-3xl mx-auto">
            Let us handle the numbers, so you can handle your success.
          </p>
          <p className="text-[#2e4f21] mb-8">Serving individuals and small businesses</p>
          <button 
            onClick={handleLogin}
            className="bg-[#2e4f21] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
          </button>
        </section>
      </main>

      <footer className="bg-[#2e4f21] text-white p-8 text-center">
        <p className="text-[#d5e4d0] text-sm">© 2025 All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Index;
