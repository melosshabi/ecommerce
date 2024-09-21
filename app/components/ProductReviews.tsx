import { useSession } from 'next-auth/react'
import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react'
import ButtonLoader from './ButtonLoader'
import parseMonth from '@/lib/parseMonth'
import Image from 'next/image'
import userIcon from '../images/user.png'

export default function ProductReviews({productId}: {productId:string}) {
    const session = useSession()
    const [reviews, setReviews] = useState<Review[]>([])
    const [showReviewForm, setShowReviewForm] = useState<boolean>(true)

    useEffect(() => {
        const controller = new AbortController()
        async function fetchReviews(){
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/productReviews?productId=${productId}`, {signal:controller.signal})
            const data = await res.json()
            setReviews([...data.reviews])
        }
        fetchReviews()
        return () => controller.abort()
    }, [])
    useEffect(() => {
        reviews.forEach((review:Review) => {
            if(review.posterDocId === session.data?.user.userDocId){
                setShowReviewForm(false)
            }
        })
    }, [reviews])
    useEffect(() => {
        if(session.status === 'unauthenticated') setShowReviewForm(false)
    }, [session])
    const [btnDisabled, setBtnDisabled] = useState<boolean>(true)
    const [starRating, setStarRating] = useState<number | null>(null)
    const [reviewText, setReviewText] = useState<string>("")

    function handleReviewChange(e:ChangeEvent<HTMLTextAreaElement>){
        setReviewText(e.target.value)
        const letterCount = document.querySelector('.letter-count') as HTMLTextAreaElement
        letterCount.innerText = `${e.target.value.length}/500`
    }
    
    function handleStarClick(starCount:number){
        setBtnDisabled(false)
        const stars = document.querySelectorAll('.stars')
        stars.forEach(star => star.classList.remove('active-star'))
        for(let i = 0; i < starCount; i++){
            stars[i].classList.add('fill-lightOrange')
        }
        if(starCount < 5){
            for(let i = starCount; i < 5; i++){
                stars[i].classList.remove('fill-lightOrange')
            }
        }
        setStarRating(starCount)
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

    const [userWantsToEditReview, setUserWantsToEditReview] = useState<boolean>(false)
    function handlePencilClick(){
        document.querySelector('.own-review-text')?.classList.add('active-own-review-text')
        setUserWantsToEditReview(true)
    }
    
    useEffect(() => {
        const editReviewTextarea: HTMLTextAreaElement | null = document.querySelector('.own-review-text')
        if(editReviewTextarea) editReviewTextarea.style.height = editReviewTextarea?.scrollHeight + 'px'
    }, [reviews])

    function handleEditReviewStarClick(targetReviewStar:string){
        const stars = document.querySelectorAll('.review-stars')
        stars.forEach(star => star.classList.remove('active-star'))
        switch(targetReviewStar){
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
    const [saveOnProgress, setSaveOnProgress] = useState<boolean>(false)
    async function updateReview(id:string, newRating:number){
        if(!newRating) newRating = 1
        setSaveOnProgress(true)
        setUserWantsToEditReview(false)
        const textarea = document.querySelector('.own-review-text') as HTMLTextAreaElement
        const reviewStars = document.querySelectorAll('.r-stars')
        reviewStars.forEach(star => star.classList.remove("r-stars-active"))
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/productReviews`, {
            method:"PATCH",
            body:JSON.stringify({
                _id:id,
                reviewText:textarea.value,
                rating:newRating
            })
        })
        const res = await req.json()
        if(res.messageCode === 'review-edited'){
            setSaveOnProgress(false)
        }
    }
  return (
    <div className="reviews w-full">
        {
            showReviewForm && 
            <div className="w-[100dvw] py-[10px] px-[2px] flex items-center justify-center bg-white shadow-[0_0_5px_black] my-8 sm:w-[90dvw] sm:m-auto sm:rounded-lg sm:my-5 lg:w-[70%] 2xl:w-[50%]">
            <form className="sm:w-[90%]" onSubmit={(e) => handleReviewSubmit(e)}>
                <div className="inline mx-8">
                    <img src={session?.data?.user.image as string} className='inline w-12'/>
                </div>
                <svg onClick={() => handleStarClick(1)}  className="stars star1 w-9 inline-block cursor-pointer hover:fill-lightOrange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
                <svg onClick={() => handleStarClick(2)}  className="stars star2 w-9 inline-block cursor-pointer hover:fill-lightOrange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
                <svg onClick={() => handleStarClick(3)}  className="stars star3 w-9 inline-block cursor-pointer hover:fill-lightOrange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
                <svg onClick={() => handleStarClick(4)}  className="stars star4 w-9 inline-block cursor-pointer hover:fill-lightOrange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
                <svg onClick={() => handleStarClick(5)} className="stars star5 w-9 inline-block cursor-pointer hover:fill-lightOrange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>

                <textarea className="m-auto mt-6 rounded-lg bg-white shadow-[0_0_5px_black] h-[20dvh] w-[90dvw] block p-2 transition-all duration-200 focus:outline-none focus:shadow-[0_0_10px] focus:shadow-orange sm:w-[90%]" maxLength={500} placeholder='Your review...' value={reviewText} onChange={e => handleReviewChange(e)}/>
                <p className="mt-2 sm:ml-8">0/500</p>
                <p className='pt-6'>{reviewRes}</p>
                <button disabled={btnDisabled} className='submit-review-btn block cursor-pointer text-white bg-orange border-none rounded-md py-3 px-4 text-[1.1em] mt-4 m-auto hover:bg-darkerOrange disabled:cursor-not-allowed disabled:opacity-70 hover:disabled:bg-orange'>{!reviewInProgress ? "Post Review"  : <ButtonLoader/>}</button>
            </form>
        </div>}

        {reviews.map((review, index) => {
            const date = new Date(review.createdAt)
            const year = date.getFullYear()
            const month = parseMonth(date.getMonth())
            const day = date.getDate()
            const hours = date.getHours()
            let minutes: number | string = date.getMinutes()
            if(minutes.toString().length === 1){
                minutes = `0${minutes}`
            }
            return (
                <div className="review w-[95dvw] m-auto my-8 flex flex-col bg-white rounded-lg shadow-[0_0_5px_black] p-4 lg:w-[70%] 2xl:w-[50%]" key={index}>
                    <div className=' flex flex-row-reverse justify-between'>
                    {review.posterDocId === session?.data?.user?.userDocId &&
                        <abbr title="Edit Review">
                            <svg onClick={() => handlePencilClick()} className='w-8 rounded-md cursor-pointer' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </abbr>
                    
                    }
                        <div className="reviewer mb-5">
                            <div className="flex items-center">
                                <Image src={review.posterProfilePicture || userIcon} width={50} height={50} alt={`${review.posterName}'s profile picture`} className="reviewer-pfp w-[50px] h-[50px]" />
                                <p className='reviewer-username text-[1em] ml-4'>{review.posterName}</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row mb-4'>
                        <svg onClick={() => handleEditReviewStarClick('star1')} className={`r-stars r-star1 w-[35px] ${parseInt(reviews[index].rating) >= 1 ? "fill-lightOrange" : ""} ${userWantsToEditReview && 'hover:fill-lightOrange cursor-pointer r-stars-active'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                        <svg onClick={() => handleEditReviewStarClick('star2')} className={`r-stars r-star2 w-[35px] ${parseInt(reviews[index].rating) >= 2 ? "fill-lightOrange" : ""} ${userWantsToEditReview && 'hover:fill-lightOrange cursor-pointer r-stars-active'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                        <svg onClick={() => handleEditReviewStarClick('star3')} className={`r-stars r-star3 w-[35px] ${parseInt(reviews[index].rating) >= 3 ? "fill-lightOrange" : ""} ${userWantsToEditReview && 'hover:fill-lightOrange cursor-pointer r-stars-active'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                        <svg onClick={() => handleEditReviewStarClick('star4')} className={`r-stars r-star4 w-[35px] ${parseInt(reviews[index].rating) >= 4 ? "fill-lightOrange" : ""} ${userWantsToEditReview && 'hover:fill-lightOrange cursor-pointer r-stars-active'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                        <svg onClick={() => handleEditReviewStarClick('star5')} className={`r-stars r-star5 w-[35px] ${parseInt(reviews[index].rating) === 5 ? "fill-lightOrange" : ""} ${userWantsToEditReview && 'hover:fill-lightOrange cursor-pointer r-stars-active'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                    </div>
                    {   review.posterDocId !== session?.data?.user?.userDocId ?
                        <p className="review-text ">{reviews[index].reviewText}</p>:
                        <textarea className={`own-review-text min-h-fit max-h-fit resize-none mb-8 p-1 focus:outline-none focus:shadow-[0_0_10px] focus:shadow-orange transition-all duration-100 ${userWantsToEditReview && "shadow-[0_0_5px_black] rounded-lg resize-y h-fit"}`} disabled={!userWantsToEditReview}>{reviews[index].reviewText}</textarea>
                    }
                    {
                        reviews[index].createdAt !== reviews[index].updatedAt &&
                        <span className='edited'>(Edited)</span>
                    }
                    {
                        review.posterDocId === session?.data?.user?.userDocId && userWantsToEditReview ?
                        <button disabled={saveOnProgress} onClick={() => updateReview(review._id, parseInt(review.rating))} className="save-edited-review-btn block cursor-pointer text-white bg-orange border-none rounded-md py-3 px-4 text-[1.1em] mt-4 m-auto hover:bg-darkerOrange disabled:cursor-not-allowed disabled:opacity-70 hover:disabled:bg-orange transition-all duration-200">{!    saveOnProgress ? "Save" : "Saving"}</button>
                        : ""
                    }
                    <p className="date-review-posted text-end">{`${day}-${month}-${year} ${hours}:${minutes}`}</p>
                </div>
            )
        })}
    </div>
)
}