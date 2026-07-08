import Link from "next/link"

function Nav() {
  return (
    <nav className="bg-[#0F1220] text-white p-4 flex items-center justify-between ">
      <div className="logo flex items-center ">
        <span className="h-[10px] w-[10px] block bg-[#C1443C] rounded-2xl "></span>
        <h1 className="text-2xl font-bold text-[#E8B04B] ml-3">REELLIST</h1>
      </div>

      <div className="navbtns flex items-center gap-4">
        <Link href="/login"><button className="h-[2.5rem] w-[4.5rem] text-white border-1 border-[#272f54]  font-bold rounded">Login</button></Link>
        <Link href="/register"><button className="h-[2.5rem] w-[6rem] bg-[#E8B04B] text-[#0F1220] border-1  font-bold rounded ">Register</button></Link>
      </div>

    </nav>
  )
}

export default Nav
