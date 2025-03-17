export default function Footer() {
  return (
    <footer className="border-t-2 border-t-muted flex justify-center items-center p-4">
      <p>&copy; {new Date().getFullYear()} <span className="italic font-bold">Budget Buddy</span>. All rights reserved.</p>
    </footer>
  )
}
