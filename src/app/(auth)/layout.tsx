import Image from "next/image";
import { Logo } from "@/components/icons";
import { LangMenu, ThemeToggle } from "@/components/header";

// Split auth shell from the Figma: form column on the left, brand panel on the
// right. The panel drops below lg, so phones get the form full width.
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid min-h-dvh grid-cols-1 bg-background lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-14">
        <div className="flex items-center justify-between gap-4">
          <Logo priority />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LangMenu />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-129">{children}</div>
        </div>
      </div>

      <BrandPanel />
    </div>
  );
}

// The panel keeps its own surface token so it can go dark without touching the
// artwork, which is a transparent PNG sitting on top of it.
function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden rounded-2xl bg-auth-panel lg:m-6 lg:ml-0 lg:block">
      <div className="px-14 pt-16">
        <p className="text-3xl font-bold text-auth-panel-foreground">
          Welcome to
        </p>
        <Logo className="mt-4 h-20" />
      </div>
      {/* Figma runs the art the full width of the panel and lets the bottom
          crop it. The height cap keeps that ratio on very wide screens. */}
      <Image
        src="/auth/hero.png"
        alt=""
        width={780}
        height={572}
        priority
        className="absolute inset-x-0 bottom-0 max-h-[72%] w-full object-contain object-bottom"
      />
    </div>
  );
}
