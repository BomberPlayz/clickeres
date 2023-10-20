'use client'
import Image from 'next/image'
import classNames from "classnames";
import {useState} from "react";
import {useEffect} from "react";
import {useRef} from "react";

function useInterval(callback, delay) {
    const intervalRef = useRef();
    const callbackRef = useRef(callback);

    // Remember the latest callback:
    //
    // Without this, if you change the callback, when setInterval ticks again, it
    // will still call your old callback.
    //
    // If you add `callback` to useEffect's deps, it will work fine but the
    // interval will be reset.

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Set up the interval:

    useEffect(() => {
        if (typeof delay === 'number') {
            intervalRef.current = window.setInterval(() => callbackRef.current(), delay);

            // Clear interval if the components is unmounted or the delay changes:
            return () => window.clearInterval(intervalRef.current);
        }
    }, [delay]);

    // Returns a ref to the interval ID in case you want to clear it manually:
    return intervalRef;
}


export default function Home() {

    var [clicks, setClicks] = useState(0);
    var [clicksChanged, setClicksChanged] = useState(false);
    var copeci = 1;
    var [cookieperclick, setCookieperclick] = useState(1);

    var [autocps, setAutocps] = useState(0);

    function vibraCookie() {
        setClicksChanged(true);
        setTimeout(() => {
            setClicksChanged(false);
        }, 50);
    }



    var [cookies, setCookies] = useState([]);
    function handleClick() {
        setClicks(clicks + cookieperclick);
        vibraCookie()
        // get the max width of the container
        var maxWidth = document.querySelector(".gamearea").offsetWidth;
        //setCookies([...cookies, {x: Math.random() * maxWidth, y: 0, id: Math.floor(Math.random() * 10000000)}]);

    }

    var [upgrades, setUpgrades] = useState([
        {
            name: "Több keksz per klikk",
            cost: 10,
            onUpgrade: () => {
                copeci++;
                setCookieperclick(copeci);
                upgrades[0].cost = Math.floor(upgrades[0].cost * 1.15);
                // trigger a rerender
                setUpgrades([...upgrades]);
            }
        },
        {
            name: "Auto keksz",
            cost: 100,
            onUpgrade: () => {
                setAutocps(autocps => autocps + 1);
                upgrades[1].cost = upgrades[1].cost * 2;
                // trigger a rerender
                setUpgrades([...upgrades]);

            }
        }
    ]);


    useInterval(() => {
        setClicks(clicks + (autocps * (cookieperclick)));
        if (autocps > 0) {
            vibraCookie()
        }
    },1000)







  return (
    <main className="flex min-h-screen flex-row items-center p-0 items-stretch">
      <div className="basis-3/4 bg-slate-400 flex-1 gamearea">



          {/*here comes the cookie for the cookie clicker*/}
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center content-center h-screen">
                {/*when clicks changes, the text gets bigger then smaller, with a css animation*/}
                <h1 className={classNames("text-8xl", {"big-text": clicksChanged, "transition-all duration-100 ease-in-out": true})}>{clicks}</h1>
                <h3 className={classNames("text-2xl")}>Auto CPS: {autocps}</h3>
                <Image onClick={handleClick} src="/cookie.png" width={200} height={200} className="cookie" />
            </div>
          </div>
      </div>
      <div className="basis-1/4">
            <div className="flex flex-col items-center justify-center content-center h-screen">
                <h1 className="text-4xl">Fejlesztések</h1>
                <div className="flex flex-col items-center justify-center content-center">
                    {upgrades.map((upgrade, index) => {
                        return (
                            <div key={index} className="flex flex-row items-center justify-center content-center">
                                <h1 className="text-2xl">{upgrade.name}</h1>
                                <button onClick={() => {
                                    if (clicks >= upgrade.cost) {
                                        setClicks(clicks - upgrade.cost);
                                        upgrade.onUpgrade();
                                        vibraCookie()

                                    }
                                }} className="bg-slate-400 text-white rounded-md p-2 ml-2 hover:bg-slate-500 transition-all duration-100 ease-in-out active:bg-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed" disabled={clicks < upgrade.cost}>{upgrade.cost} keksz</button>
                            </div>
                        )
                    })}
                </div>
            </div>
      </div>
    </main>
  )
}
