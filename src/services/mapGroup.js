import React from 'react';
import Link from '../components/Link';

export const MAP_GROUPS = {
    crimea: {
        name: 'Crimea',
        regions: ['US', 'RU', 'UA'],
        radius: 1.5e5,
        center: ['45.3', '34.1'],
        zoom: 6,
        description: <>
            <p>
                In 2014, the Russian Federation began a military occupation of the Crimean peninsula in Ukraine.
                Although
                the United Nations refuses to recognize the annexation, companies such as Google faced pressure to
                redraw borders under threat of criminal prosecution.
            </p>
            <p>
                Google Maps usually draws a special "disputed" border between the countries. However, when viewed from
                Russia, the border appears solid. In Ukraine, no border is visible at all.
            </p>
            {/*<p>*/}
            {/*   */}
            {/*</p>*/}
            <p>
                <Link href="https://apnews.com/article/dfe637594e36792a2b89b66134ccde0e">
                    Associated Press, 2019
                </Link>
            </p>
        </>,
    },
    jammu_kashmir: {
        name: 'Jammu and Kashmir',
        regions: ['PK', 'IN', 'CN'],
        radius: 5e5,
        center: [33.77, 76.57],
        zoom: 5,
        description: <>
            <p>
                The conflict over Jammu and Kashmir has raged between India and Pakistan since 1947. Today, the regions
                are fraught with violence and human rights abuses.
            </p>
            <p>
                After receiving threats of severe legal action against Google employees, Jammu and Kashmir
                currently appear "undisputed" when viewed from India.
            </p>
            <p>
                Furthermore, China also claims parts of each region, resulting in another "undisputed" border when
                viewed from China.
            </p>
            <p>
                <Link href="https://www.amnesty.org/en/countries/asia-and-the-pacific/india/report-india/">
                    Amnesty International, 2019
                </Link>
            </p>
            <p>
                <Link href="https://www.washingtonpost.com/news/worldviews/wp/2016/05/06/cartographers-beware-india-warns-of-15-million-fine-for-maps-it-doesnt-like/">
                    Washington Post, 2016
                </Link>
            </p>
        </>,
    },
    // palestine: {
    //     name: 'Palestine',
    //     regions: ['US', 'IL', 'PS'],
    //     radius: 1.5e5,
    //     center: [31.9522, 35.2332],
    //     zoom: 6,
    // },
};