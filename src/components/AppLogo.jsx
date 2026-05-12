/** Герб (логотип застосунку) — `public/logo.png` */
export default function AppLogo({ className = '', size = 64 }) {
  return (
    <img
      src="/logo.png"
      alt="MójInspektor"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      decoding="async"
    />
  )
}
