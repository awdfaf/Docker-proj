import Link from 'next/link'

export default function Main() {
    return (
        <div>
            <p><Link href="/authPage">인증페이지</Link></p>
            <p><Link href="/voice">보이스피싱 탐지</Link></p>
            <p><Link href="/text">문자피싱 탐지</Link></p>
        </div>
    )
}