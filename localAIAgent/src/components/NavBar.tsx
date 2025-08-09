import { Link } from "react-router-dom"

export default function Navbar() {
    const classLink = "hover:bg-zinc-800 border-b-2 rounded-lg border-b-transparent p-2  transition-all"
    return (
        <div className=' bg-inherit text-rose-500  fixed w-full top-0 z-50'>
            <nav className='flex justify-between items-center p-4   ' >
                <Link to='/'>
                    <h1 className='text-2xl gradiant_text'>Escarlet AI</h1>
                </Link>
                <ul className='flex space-x-4 items-center justify-center align-middle'>
                    <Link to='/chat'><li className={classLink}>
                        <img alt='chat' className='object-cover' width={30} height={30} src='/img/logoProjectEscarlet-removebg.png'></img>
                    </li></Link>
                </ul>
            </nav>
        </div>
    )
}