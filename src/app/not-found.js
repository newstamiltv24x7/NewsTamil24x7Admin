import Image from "next/image"
import NotFoundImg from "@/public/assets/images/page-not-found/pagenotfound.jpg"
import Link from "next/link"
export default function NotFound(){
    return(
        <div style={{height: "100vh"}}>
            <Link href="/">
            <Image style={{width: "100%", objectFit: "contain", height: "100%"}} src={NotFoundImg} alt="" />
            </Link>
        </div>
        
    )
}