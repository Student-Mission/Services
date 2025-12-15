
function ErrorBox({content, className=''}) {

    return (
        <div className={`mt-1 roboto text-red-500 ${className}`}>
            {
                content.en
            }
        </div>
    )
}

export default ErrorBox;
