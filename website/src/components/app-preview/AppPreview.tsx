import AppP from "../../assets/preview/imageD.svg"
const AppPreview = () => {
    return (
        <div className="w-full px-[3%] flex justify-center items-center py-20  ">
            <img loading="lazy" src={AppP} alt="" className="w-full mx-auto" />

        </div>
    )
}

export default AppPreview
