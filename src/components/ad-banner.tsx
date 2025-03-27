import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"

export function AdBanner() {
    return (
        <Card className="h-[200px] overflow-hidden">
            <Link href="/" className="block h-full">
                <CardContent className="p-0 h-full flex flex-col lg:flex-row items-center">
                    <div className="relative h-full w-1/2">
                        <Image src="/logo.png?height=200&width=200" alt="Mobile App Logo" layout="fill" objectFit="cover" />
                    </div>
                    <div className="p-4 w-1/2">
                        <CardTitle>Download Our App!</CardTitle>
                        <CardDescription>Get your analytics anywhere you go.</CardDescription>
                    </div>
                </CardContent>
            </Link>
        </Card>
    )
}