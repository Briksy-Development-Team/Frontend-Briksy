import AppP from "../../assets/preview/appPP.png"
const AppPreview = () => {
    return (
        <div className="w-full flex justify-center items-center py-20  ">
            <img loading="lazy" src={AppP} alt="" className="w-[90%] mx-auto" />

        </div>
    )
}

export default AppPreview
