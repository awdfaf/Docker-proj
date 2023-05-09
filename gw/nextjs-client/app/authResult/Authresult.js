'use client'
import {
    usePathname,
    useRouter,
    useSearchParams,
    useSelectedLayoutSegment,
    useSelectedLayoutSegments,
    redirect,  
    notFound,
} from 'next/navigation';
import queryString from 'query-string';


export default function Authresult() {
    const router = useSearchParams();
    const queryStr = router.toString(); // URLSearchParams 객체를 문자열로 변환합니다.
    const parsedQuery = queryString.parse(queryStr); // 문자열을 파싱하여 객체 형식으로 변환합니다.

    console.log(parsedQuery);
    
    return(
        <div></div>
    )
}