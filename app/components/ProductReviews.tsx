import { useSession } from 'next-auth/react'
import React, {ChangeEvent, FormEvent, TextareaHTMLAttributes, useEffect, useState} from 'react'
import ButtonLoader from './ButtonLoader'

export default function ProductReviews({productId}: {productId:string}) {
    const session = useSession()
    const [reviews, setReviews] = useState<frontEndReview[] | null>(null)
    const [reviewPosters, setReviewPosters] = useState<PublicUserInfo[]>([])

    useEffect(() => {
        const controller = new AbortController()
        async function fetchReviews(){
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/productReviews`, {signal:controller.signal})
            const data = await res.json()
            setReviews(data)
        }
        fetchReviews()
        return () => controller.abort()
    }, [])

    useEffect(() => {
        let tempReviewers: PublicUserInfo[] = []
        reviews?.forEach(async review => {
            const reviewerData = await fetchReviewer(review.posterDocId)
            setReviewPosters(prev => [...prev, {...reviewerData}])
        })
    }, [reviews])

    async function fetchReviewer(userId:string): Promise<PublicUserInfo>{
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/publicUserData?_id=${userId}`)
            const userData: PublicUserInfo = await res.json()
            return userData

    }
    const [btnDisabled, setBtnDisabled] = useState<boolean>(true)
    const [reviewText, setReviewText] = useState<string>("")

    function handleReviewChange(e:ChangeEvent<HTMLTextAreaElement>){
        setReviewText(e.target.value)
        const letterCount = document.querySelector('.letter-count') as HTMLTextAreaElement
        letterCount.innerText = `${e.target.value.length}/500`
    }
    const [starRating, setStarRating] = useState<number | null>(null)
    
    function handleStarClick(targetStar:string){
        setBtnDisabled(false)
        const stars = document.querySelectorAll('.stars')
        stars.forEach(star => star.classList.remove('active-star'))
        switch(targetStar){
            case 'star1':
                stars[0].classList.add('active-star')
                setStarRating(1)
                break
            case 'star2':
                stars[0].classList.add('active-star')
                stars[1].classList.add('active-star')
                setStarRating(2)
                break
            case 'star3':
                stars[0].classList.add('active-star')
                stars[1].classList.add('active-star')
                stars[2].classList.add('active-star')
                setStarRating(3)
                break
            case 'star4':
                stars[0].classList.add('active-star')
                stars[1].classList.add('active-star')
                stars[2].classList.add('active-star')
                stars[3].classList.add('active-star')
                setStarRating(4)
                break
            case 'star5':
                stars.forEach(star => star.classList.add('active-star'))
                setStarRating(5)
                break
        }
    }
    const [reviewInProgress, setReviewInProgress] = useState<boolean>(false)
    const [reviewRes, setReviewRes] = useState<string>("")
    async function handleReviewSubmit(e:FormEvent){
        e.preventDefault()
        setReviewInProgress(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/productReviews`, {
            method:'POST',
            body:JSON.stringify({
                posterDocId:session?.data?.user.userDocId,
                productId,
                rating:starRating,
                reviewText
            })
        })
        setBtnDisabled(true)
        const data = await res.json()
        setReviewRes(data.responseMessage)
        setReviewInProgress(false)
        setTimeout(() => window.location.reload(), 3000)
    }
  return (
    <div className="reviews">
        <div className="post-review-form-wrapper">
            <form className="post-review-form" onSubmit={(e) => handleReviewSubmit(e)}>
                <div className="review-form-pfp">
                    <img src={session?.data?.user.image as string}/>
                </div>
                <svg onClick={(e) => handleStarClick('star1')}  className="stars star1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
                <svg onClick={() => handleStarClick('star2')}  className="stars star2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
                <svg onClick={() => handleStarClick('star3')}  className="stars star3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
                <svg onClick={() => handleStarClick('star4')}  className="stars star4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
                <svg onClick={() => handleStarClick('star5')} className="stars star5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>

                <textarea maxLength={500} placeholder='Your review...' value={reviewText} onChange={e => handleReviewChange(e)}>
                    
                </textarea>
                <p className="letter-count">0/500</p>
                <p className='letter-count review-posted-message'>{reviewRes}</p>
                <button disabled={btnDisabled} className='submit-review-btn'>{!reviewInProgress ? "Post Review"  : <ButtonLoader/>}</button>
            </form>
        </div>

        {reviews?.map((review, index) => {
            return (
                <div className="review" key={index}>
                    {reviewPosters?.length && <p>{reviewPosters![index].username}</p>}
                    <p>{review.reviewText}</p>
                </div>
            )
        })}
    </div>
  )
}
