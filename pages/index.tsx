import type {NextPage} from 'next';
import UAParser from 'ua-parser-js';

import Head from 'next/head';
import Image from 'next/image';
import {LegacyRef, useEffect, useRef, useState} from 'react';
import styles from '../styles/Home.module.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
const responsive = {
    desktop: {
        breakpoint: {max: 3000, min: 1024},
        items: 2,
        partialVisibilityGutter: 40, // this is needed to tell the amount of px that should be visible.
    },
    tablet: {
        breakpoint: {max: 1024, min: 464},
        items: 2,
        partialVisibilityGutter: 30, // this is needed to tell the amount of px that should be visible.
    },
    mobile: {
        breakpoint: {max: 464, min: 0},
        items: 2,
        partialVisibilityGutter: 30, // this is needed to tell the amount of px that should be visible.
    },
};

// https://usehooks.com/useOnScreen/
function useOnScreen(rootMargin = '0px') {
    const ref = useRef<Element>() as React.MutableRefObject<HTMLInputElement>;
    // State and setter for storing whether element is visible
    const [isIntersecting, setIntersecting] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Update our state when observer callback fires
                setIntersecting(entry.isIntersecting);
            },
            {
                rootMargin,
            }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return [isIntersecting, ref] as [
        boolean,
        LegacyRef<HTMLDivElement> | undefined
    ];
}
function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function ParagraphPlaceholder({lines}: {lines: number}) {
    const [linesLeft, setLinesLeft] = useState(lines / 3);
    useEffect(() => {
        const interval = setInterval(() => {
            setLinesLeft(linesLeft + randInt(2, 4));
        }, 2000);
        return () => clearInterval(interval);
    }, [linesLeft]);
    const [lineSizes] = useState(() =>
        Array(lines)
            .fill(0)
            .map(() => randInt(4, 8))
    );
    return (
        <>
            {lineSizes.slice(0, linesLeft).map((size, index) => (
                <>
                    <span
                        key={size + '' + index}
                        className={`placeholder col-${size}`}
                    ></span>{' '}
                </>
            ))}
        </>
    );
}
function TabContent({name, ariaLabel, defaultActive}: any) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, visibleRef] = useOnScreen();
    useEffect(() => {
        if (isVisible && data === null && !isLoading) {
            setIsLoading(true);
            fetch('https://swapi.dev/api/people/' + randInt(1, 20)).then(
                async (response) => {
                    const d = await response.json();
                    setData(d);
                    setIsLoading(false);
                }
            );
        }
    }, [isVisible, data, isLoading]);
    return (
        <div
            ref={visibleRef}
            className={'tab-pane fade show ' + (defaultActive ? 'active' : '')}
            id={name}
            role="tabpanel"
            aria-labelledby={ariaLabel}
        >
            <div className="card-body">
                {(isLoading || data != null) &&
                    (data == null ? (
                        <div>
                            <h5 className="card-title placeholder-glow">
                                <span className="placeholder col-6"></span>
                            </h5>
                            <p className="card-text placeholder-glow">
                                <ParagraphPlaceholder lines={18} />
                            </p>
                        </div>
                    ) : (
                        <div className="card-text">
                            <pre>{JSON.stringify(data, null, '  ')}</pre>
                        </div>
                    ))}
            </div>
        </div>
    );
}

function NavTabButton({name, bsTarget, ariaLabel, defaultActive}: any) {
    return (
        <li className="nav-item" role="presentation">
            <button
                className={'nav-link ' + (defaultActive ? 'active' : '')}
                id={name}
                data-bs-toggle="tab"
                data-bs-target={bsTarget}
                type="button"
                role="tab"
                aria-controls={ariaLabel}
                aria-selected={defaultActive ? 'true' : 'false'}
            >
                {name.split('-')[0]}
            </button>
        </li>
    );
}
const slides = ['Slide1', 'Slide2', 'Slide3', 'Slide4', 'Slide5', 'Slide6'];
const Home: NextPage<{deviceType: string}> = ({deviceType}) => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title + ' mb-4 pb-4'}>
                    Welcome to <a href="https://nextjs.org">Next.js!</a>
                </h1>
                <div className={styles.grid}>
                    <Carousel
                        swipeable={false}
                        draggable={false}
                        showDots={true}
                        ssr={true} // means to render carousel on server-side.
                        infinite={false}
                        autoPlay={false}
                        autoPlaySpeed={1000000000}
                        keyBoardControl={true}
                        responsive={responsive}
                        deviceType={deviceType}
                    >
                        {slides.map((slide) => (
                            <div
                                key={slide}
                                className="card d-block m-2 p-2 overflow-hidden"
                                style={{height: 500}}
                            >
                                <h1>{slide}</h1>
                                <ul
                                    className="nav nav-tabs"
                                    id={'myTab' + slide}
                                    role="tablist"
                                >
                                    <NavTabButton
                                        name={'home-tab' + slide}
                                        bsTarget={'#home' + slide}
                                        ariaLabel={'home' + slide}
                                        defaultActive
                                    />
                                    <NavTabButton
                                        name={'profile-tab' + slide}
                                        bsTarget={'#profile' + slide}
                                        ariaLabel={'profile' + slide}
                                    />
                                    <NavTabButton
                                        name={'contact-tab' + slide}
                                        bsTarget={'#contact' + slide}
                                        ariaLabel={'contact' + slide}
                                    />
                                </ul>
                                <div
                                    className="tab-content"
                                    id={'myTabContent' + slide}
                                >
                                    <TabContent
                                        name={'home' + slide}
                                        ariaLabel={'home-tab' + slide}
                                        defaultActive
                                    />
                                    <TabContent
                                        name={'profile' + slide}
                                        ariaLabel={'profile-tab' + slide}
                                    />
                                    <TabContent
                                        name={'contact' + slide}
                                        ariaLabel={'contact-tab' + slide}
                                    />
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <span className={styles.logo}>
                        <Image
                            src="/vercel.svg"
                            alt="Vercel Logo"
                            width={72}
                            height={16}
                        />
                    </span>
                </a>
            </footer>
        </div>
    );
};

Home.getInitialProps = ({req}) => {
    let userAgent;
    if (req) {
        userAgent = req.headers['user-agent'];
    } else {
        userAgent = navigator.userAgent;
    }
    const parser = new UAParser();
    parser.setUA(userAgent as string);
    const result = parser.getResult();
    const deviceType = (result.device && result.device.type) || 'desktop';

    return {deviceType};
};

export default Home;
