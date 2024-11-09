import React from 'react'

const FileUpload = (props) => {
    
    const as = props.as;
    const fld_id = props.fld_id;


    return (
        <div>
            <form
                className="flex flex-col gap-5 items-center"
                method="POST"
                encType="multipart/form-data"
                action={as}
                >
                <input type="hidden" name="key" value="11124m28yb5z5qbkuh1ru" />
                <input type="hidden" name="html_redirect" value="1" />
                <input type="hidden" name="fld_id" value={fld_id} />
                <div className="flex flex-col items-center justify-around gap-[25px]">
                <label
                    htmlFor="name"
                    className="text-white font-mono text-[18px]"
                    >
                    Upload Files
                </label>
                <input
                    className="text-[20px]"
                    type="file"
                    id="file"
                    name="file"
                    multiple
                    />
                </div>
                <button
                className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[20px] border-0  text-white font-fantasy bg-gradient-to-r from-[#ca3bda] to-[#733aba]"
                type="submit"
                >
                Upload
                </button>
            </form>
        </div>
  )
}

export default FileUpload