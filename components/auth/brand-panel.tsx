import Image from "next/image";
import Logo from "@/public/Logo-on-darkbg.png";
import { VoiceWave } from "./voice-wave";

function Headline({ className }: { className?: string }) {
  return (
    <h2 className={className}>
      <span className="block font-sans text-[43px] font-medium leading-[1] tracking-[-0.085em] text-[#f6f7f2] lg:text-[88px] lg:leading-[0.92]">
        Find the words
      </span>
      <span className="block font-serif text-[42.5px] italic leading-[1] tracking-[-0.01em] text-lime lg:mt-[6px] lg:text-[84px] lg:leading-[1]">
        before they count.
      </span>
    </h2>
  );
}

function EyebrowDot() {
  return (
    <p className="flex items-center gap-[10px] text-[13px] font-bold uppercase leading-none tracking-[0.075em] text-lime">
      <span className="h-[6px] w-[6px] rounded-full bg-lime" />
      Clinical speaking practice
    </p>
  );
}

/** Desktop: the dark left half of every auth screen. */
export function BrandPanel({ wide = false }: { wide?: boolean }) {
  return (
    <aside className={`relative hidden ${wide ? "w-[54%]" : "w-[53.7%]"} shrink-0 flex-col justify-between bg-ink pb-[46px] pl-[72px] pr-[60px] pt-[44px] lg:flex`}>
      <Image src={Logo} alt="the round" className="w-[119px]" priority />

      <div>
        <EyebrowDot />
        <Headline className="mt-[27px]" />
        <p className="mt-[20px] max-w-[520px] text-[17px] leading-[28px] text-white/60">
          Short, focused rounds that help you organise clinical knowledge and say it clearly.
        </p>

        <div className="mt-[59px] w-[500px] max-w-full rounded-[20px] border border-brand-line bg-brand-card px-[20px] pb-[16px] pt-[21px]">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase leading-none tracking-[0.06em] text-lime">Practice prompt</span>
            <span className="num text-[13px] leading-none text-white/60">01:30</span>
          </div>
          <p className="mt-[17px] max-w-[380px] text-[15.4px] leading-[21px] text-white">
            How would you recognise and manage a postpartum haemorrhage?
          </p>
          <VoiceWave className="mt-[16px]" />
        </div>

        <p className="mt-[33px] flex items-center gap-[14px] text-[12px] font-medium uppercase leading-none tracking-[0.1em] text-white/45">
          Think clearly
          <span className="h-px w-[24px] bg-white/25" />
          Speak confidently
        </p>
      </div>
    </aside>
  );
}

/** Mobile: compact brand header shown above the sign-in form. */
export function BrandHeader() {
  return (
    <header className="bg-ink px-[20px] pb-[27px] pt-[22px] lg:hidden">
      <Image src={Logo} alt="the round" className="w-[119px]" priority />
      <div className="mt-[97px]">
        <EyebrowDot />
        <Headline className="mt-[26px]" />
        <p className="mt-[16px] text-[14px] leading-[22px] text-white/60">
          Short, focused rounds that help you organise clinical knowledge and say it clearly.
        </p>
      </div>
    </header>
  );
}
