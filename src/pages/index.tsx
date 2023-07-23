import Image from "next/image";
import { Inter, Roboto } from "next/font/google";
import background from "@/assets/background-home.png";
import { GoogleLogo } from "phosphor-react";
import { signIn,  useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: ["100", "300", "500", "700", "900"],
  subsets: ["latin"],
});
export default function Home() {
  const {data: session} = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user) {
      router.push('/register/form-step')
      // axios
      //   .post("/api/createUser", {
      //     name: session.user.name,
      //     email: session.user.email,
      //   })
      //   .then((response) => {
      //     console.log("Usuário criado com sucesso:", response.data);
      //   })
      //   .catch((error) => {
      //     console.error("Erro ao criar usuário:", error);
      //   });
    }
  }, [session]);
  

  
  return (
    <div>
      <Image
        className="h-full object-cover w-full -z-10 absolute top-0 left-0 overflow-hidden blur-[6px] "
        width={500}
        height={500}
        src={background}
        alt=""
      />
      <main
        className={`w-screen h-screen flex justify-center items-center ${roboto.className}`}
      >
        <div className="bg-zinc-900 flex flex-col justify-center items-center p-6 rounded-lg gap-8">
          <h1 className="text-gray-100 font-bold text-5xl ">CEDUP CLASS</h1>
          <div className="flex flex-col justify-center items-center gap-2 w-full">
              
                <button 
                  onClick={() => signIn("google")} 
                  className="bg-red-500 p-3 flex gap-2 text-white  justify-center items-center rounded-md font-medium text-sm w-full transition-all hover:opacity-70">
                  <GoogleLogo size={16} />
                  Entrar com Google
               </button>
           
            <h2 className="text-stone-400 font-normal text-xs">
              Veja os horários de suas aulas atualizado!
            </h2>
          </div>
        </div>
      </main>
    </div>
  );
}
