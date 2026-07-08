import Link from "next/link"

function page() {
  return (
    <div className="loginContainer bg-[#161b2dca]">
        <div className="loginCard flex flex-col h-[80vh] w-[70vh] bg-[#171b2e] border-1 border-[#4c4c5169] rounded-[10px] flex justify-self-center  m-[1.5rem]">
            <div className="flex flex-col items-center justify-center mx-[2rem] my-[1.25rem]">
              <span className="text-[12px] text-[#906f33]">ADMIT ONE</span>
              <h1 className="loginHeading text-3xl font-bold mt-[0.75rem] mb-[1rem] flex justify-center">WELCOME BACK</h1>  
              <p className="loginParagraph text-[15px] text-gray-400">Sign in to pick up where you left off.</p>
            </div>
            
            <form className="loginForm flex flex-col mx-[1rem] gap-[1.5rem]">
                <label htmlFor="username" className="loginLabel flex flex-col gap-[0.25rem] mx-[1rem] w-[90%] text-gray-400">
                    Username
                    <input id="username" type="text" placeholder="Username" className="loginInput h-[2rem]  bg-[#20243c] border-1 border-gray-700 rounded-[4px] py-[1.25rem] px-[0.5rem] focus:outline-none focus:border-[#E8B04B]"/>
                </label>
                <label htmlFor="password" className="loginLabel flex flex-col gap-[0.25rem] mx-[1rem] text-gray-400 w-[90%] ">
                    Password
                    <input id="password" type="password" placeholder="Password" className="loginInput h-[2rem] bg-[#20243c] border-1 border-gray-700 py-[1.25rem] rounded-[4px] px-[0.5rem] focus:outline-none focus:border-[#E8B04B]"/>
                </label>
                <button type="submit" className="loginButton h-[1.5rem] w-[90%] flex items-center justify-center bg-[#E8B04B] text-[#0F1220] font-semibold border-1 border-gray-700 rounded-[4px] py-[1.25rem] px-[0.5rem] mt-[1.75rem] mx-[1rem]">Enter the Theatre</button>
            </form>

            <p className="text-[15px] text-gray-500 mt-[1rem] mb-[1rem] m-auto">No account yet?<Link href="/register" className="text-[#E8B04B] hover:underline m-1">Get a ticket</Link></p>
            
        </div>
    </div>
  )
}

export default page;
