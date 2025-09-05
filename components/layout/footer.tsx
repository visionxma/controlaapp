import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background py-6 px-6">
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>Criado por</span>
        <Link
          href="https://visionxma.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Image
            src="https://visionxma.com/assets/visionx-logo.png"
            alt="VisionX"
            width={80}
            height={24}
            className="h-6 w-auto"
          />
        </Link>
      </div>
    </footer>
  )
}
