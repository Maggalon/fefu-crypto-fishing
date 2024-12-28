import { Tooltip } from "react-tooltip"

const url = "https://t.me/fefu_crypto_bot"
const text = "Присоединяйся к FEFU Crypto! Все начинается с простой рыбалки, но кто знает, где мы окажемся в будущем. При создании кошелька используй код: "

export default function ReferralButtons({ referralCode }: {referralCode: string}) {
  
    return (
      <div className='flex gap-2 px-4 py-5 sm:px-6'>
        <a 
          className='bg-white/70 rounded-md p-2 font-bold'
          href={`https://t.me/share/url?url=${encodeURI(url)}&text=${encodeURI(text + "`" + referralCode + "`")}`}
        >
          Пригласить друзей
        </a>
        <div className="rounded-md p-2 bg-black/10 font-bold flex justify-center items-center border border-white/70 text-white/70">{referralCode}</div>
        <div data-tooltip-id="copied" 
            data-tooltip-content={"Скопировано"}
            data-tooltip-place="top"
            onClick={() => navigator.clipboard.writeText(referralCode)}
            className="flex justify-center items-center p-2 cursor-pointer bg-white/70 rounded-md">
            <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
                >
                <path d="M6 6V2c0-1.1.9-2 2-2h10a2 2 0 012 2v10a2 2 0 01-2 2h-4v4a2 2 0 01-2 2H2a2 2 0 01-2-2V8c0-1.1.9-2 2-2h4zm2 0h4a2 2 0 012 2v4h4V2H8v4zM2 8v10h10V8H2z" />
            </svg>
        </div>
        <Tooltip id="copied" openOnClick={true} delayHide={1000} />
      </div>
    )
  }