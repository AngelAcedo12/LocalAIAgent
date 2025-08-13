import React from 'react'
import GitHubIcon from '../../components/icons/GitHubIcon'
import { Link, Router, useNavigate } from 'react-router-dom';
import Navbar from '../../components/NavBar';
import { DefaultModelDownloadButton } from '../../components/DefaultModelDownloadButton';
import appConfig from '../../utils/appConfig';

export default function Home() {
    const navigate = useNavigate();


    return (

        <main className="flex h-screen flex-col items-center justify-between   p-4   ">

            <section className="flex flex-col  align-middle items-center gap-10 justify-center animate-fade-up h-[80dvh] ">
                <h1
                    className="md:text-4xl text-2xl font-bold gradiant_text bg-gradient-to-r from-sky-500/20 animate-fade-up text-rose-500 to-sky-500/75  bg-clip-text">
                    Bienvenido a Escarlet AI
                </h1>


                {/* <Link
                    className="border-rose-500 border rounded-full p-2  animate-fade-up hover:bg-white mt-10 hover:text-black transition-all"
                    to="/models"
                >
                    Ver modelos disponibles
                </Link> */}
                {
                    appConfig.defaultModelIsDownloading != true ? <DefaultModelDownloadButton></DefaultModelDownloadButton> : <Link to="/chat" className="border-rose-500 border rounded-full p-2  animate-fade-up hover:bg-white mt-10 hover:text-black transition-all">
                        Empezar a chatear
                    </Link>
                }

                {/* <ButtonLink href="/chat" text="Emperzar a chatear" className="border-rose-500 border rounded-full p-2  animate-fade-up hover:bg-white mt-10 hover:text-black transition-all " ></ButtonLink> */}
            </section>

            <section className="flex flex-row justify-start items-start">
                <div className="flex flex-row justify-start">
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-all"
                        href="https://github.com/AngelAcedo12/Escarlet-IA">
                        <GitHubIcon width={30} height={30} className="fill-rose-500"></GitHubIcon>
                    </a>
                </div>

            </section>

        </main>



    )
}
