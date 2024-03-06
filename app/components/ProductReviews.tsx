import { useSession } from 'next-auth/react'
import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react'
import ButtonLoader from './ButtonLoader'
import parseMonth from '@/lib/parseMonth'

export default function ProductReviews({productId}: {productId:string}) {
    const session = useSession()
    const [reviews, setReviews] = useState<frontEndReview[]>([])
    const [reviewPosters, setReviewPosters] = useState<PublicUserInfo[]>([])

    useEffect(() => {
        const controller = new AbortController()
        async function fetchReviews(){
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/productReviews?productId=${productId}`, {signal:controller.signal})
            const data = await res.json()
            setReviews(data)
        }
        fetchReviews()
        return () => controller.abort()
    }, []) 
    const [showReviewForm, setShowReviewForm] = useState<boolean>(session.status === "authenticated" ? true : false)
    useEffect(() => {
        reviews?.forEach(async review => {
            if(review.posterDocId === session?.data?.user?.userDocId) {
                setShowReviewForm(false)
            }
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
    const [starRating, setStarRating] = useState<number | null>(null)
    const [reviewText, setReviewText] = useState<string>("")

    function handleReviewChange(e:ChangeEvent<HTMLTextAreaElement>){
        setReviewText(e.target.value)
        const letterCount = document.querySelector('.letter-count') as HTMLTextAreaElement
        letterCount.innerText = `${e.target.value.length}/500`
    }
    
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

    const [userWantsToEditReview, setUserWantsToEditReview] = useState<boolean>(false)
    function handlePencilClick(){
        const reviewStars = document.querySelectorAll('.review-stars')
        reviewStars.forEach(star => {
            star.classList.add('editable-review-stars')
        })
        document.querySelector('.own-review-text')?.classList.add('active-own-review-text')
        setUserWantsToEditReview(true)
    }
    
    useEffect(() => {
        const editReviewTextarea: HTMLTextAreaElement | null = document.querySelector('.own-review-text')
        if(editReviewTextarea) editReviewTextarea.style.height = editReviewTextarea?.scrollHeight + 'px'
    }, [reviewPosters])

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
    async function updateReview(id:string){
        setSaveOnProgress(true)
        setUserWantsToEditReview(false)
        const textarea = document.querySelector('.own-review-text') as HTMLTextAreaElement
        textarea.classList.remove("active-own-review-text")
        const reviewStars = document.querySelectorAll('.review-stars')
        reviewStars.forEach(star => star.classList.remove("editable-review-stars"))
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/productReviews`, {
            method:"PATCH",
            body:JSON.stringify({
                _id:id,
                reviewText:textarea.value,
                rating:starRating
            })
        })
        const res = await req.json()
        if(res.messageCode === 'review-edited'){
            // window.location.reload()
            setSaveOnProgress(false)
        }
    }
  return (
    <div className="reviews">
        {
            showReviewForm && 
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
        </div>}

        {reviewPosters.map((reviewer, index) => {
            const date = new Date(reviews[index].datePosted)
            const year = date.getFullYear()
            const month = parseMonth(date.getMonth())
            const day = date.getDate()
            const hours = date.getHours()
            let minutes: number | string = date.getMinutes()
            if(minutes.toString().length === 1){
                minutes = `0${minutes}`
            }

            return (
                <div className="review" key={index}>
                    {reviewer.userDocId === session?.data?.user?.userDocId &&
                        <abbr title="Edit Review">
                            <svg onClick={() => handlePencilClick()} className='pencil' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </abbr>
                    
                    }
                    <div className="reviewer">
                        <div className="reviewer-pfp-wrapper">
                            <img src={reviewer.profilePicture} alt={`${reviewer.username}'s profile picture`} className="reviewer-pfp" />
                            <p className='reviewer-username'>{reviewer.username}</p>
                        </div>
                    </div>
                        <svg onClick={() => handleEditReviewStarClick('star1')} className={`review-stars r-star1 ${parseInt(reviews[index].rating) >= 1 ? "active-star" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                        <svg onClick={() => handleEditReviewStarClick('star2')} className={`review-stars r-star2 ${parseInt(reviews[index].rating) >= 2 ? "active-star" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                        <svg onClick={() => handleEditReviewStarClick('star3')} className={`review-stars r-star3 ${parseInt(reviews[index].rating) >= 3 ? "active-star" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                        <svg onClick={() => handleEditReviewStarClick('star4')} className={`review-stars r-star4 ${parseInt(reviews[index].rating) >= 4 ? "active-star" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                        <svg onClick={() => handleEditReviewStarClick('star5')} className={`review-stars r-star5 ${parseInt(reviews[index].rating) === 5 ? "active-star" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                    {   reviewer.userDocId !== session?.data?.user?.userDocId ?
                        <p className="review-text">{reviews[index].reviewText}</p>:
                        <textarea className="review-text own-review-text" disabled={!userWantsToEditReview}>{reviews[index].reviewText}</textarea>
                    }
                    {
                        reviews[index].datePosted !== reviews[index].dateEdited &&
                        <span className='edited'>(Edited)</span>
                    }
                    {
                        reviewer.userDocId === session?.data?.user?.userDocId && userWantsToEditReview ?
                        <button disabled={saveOnProgress} onClick={() => updateReview(reviews[index]._id)} className="save-edited-review-btn">{!    saveOnProgress ? "Save" : "Saving"}</button>
                        : ""
                    }
                    <p className="date-review-posted">{`${day}-${month}-${year} ${hours}:${minutes}`}</p>
                </div>
            )
        })}
    </div>
  )
}
