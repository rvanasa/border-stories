import React, {useState} from 'react';

import {Circle, GoogleMap, Marker, withGoogleMap, withScriptjs} from 'react-google-maps';
import Select from 'react-select';
import classNames from 'classnames';
import './App.scss';
import {MAP_REGIONS} from '../services/mapRegion';
import queryString from 'query-string';
import {MAP_STYLES} from '../services/mapStyle';
import {MAP_GROUPS} from '../services/mapGroup';
import {FaArrowUp, FaQuestionCircle, FaTimes} from 'react-icons/all';
import Link from './Link';

export default function App() {
    let [detail, setDetail] = useState(null);

    let queryOptions = {
        arrayFormat: 'separator',
        arrayFormatSeparator: ';',
        skipNull: true,
        skipEmptyString: true,
    };
    let query = queryString.parse(window.location.search, queryOptions);

    let group = query.group || null;
    let region = query.region;// || 'US';
    let center = parsePosition(query.center || '40;40');
    let zoom = +query.zoom || 3;

    let map = null;

    function parsePosition(pos) {
        if(!pos) {
            return null;
        }
        if(typeof pos === 'string') {
            pos = pos.split(';');
        }
        let [lat, lng] = pos;
        return [+lat || 0, +lng || 0];
    }

    function getMapParams() {
        return map && {
            center: [map.getCenter().lat(), map.getCenter().lng()],
            zoom: map.getZoom(),
        };
    }

    function setView(delta, resetAll) {
        if(delta.center && delta.zoom > 0) {
            let digits = Math.pow(10, delta.zoom);
            delta.center = delta.center.map(n => Math.round(n * digits) / digits);
        }
        window.location.search = queryString.stringify({
            ...(!resetAll && queryString.parse(window.location.search, queryOptions)),
            ...delta,
        }, queryOptions);
    }

    const RegionZone = ({radius, label, group, region, center, zoom}) => {
        center = parsePosition(center);
        let centerLatLng = {lat: center[0], lng: center[1]};
        let onClick = () => setView({group, region, center, zoom});
        return (
            <>
                <Circle
                    defaultOptions={{
                        strokeOpacity: .3,
                        strokeColor: '#0a4d9f',
                        fillOpacity: .05,
                    }}
                    radius={radius}
                    center={centerLatLng}
                    onClick={onClick}
                />
                {label && (
                    <Marker
                        defaultIcon="__hidden__"
                        label={{
                            text: label,
                            fontSize: '20px',
                        }}
                        position={centerLatLng}
                        onClick={onClick}
                    />
                )}
            </>
        );
    };

    const PerspectiveMarker = ({label, group: expectedGroup, region, center, zoom}) => {
        if(expectedGroup !== group) {
            return null;
        }
        center = parsePosition(center);
        return (
            <Marker
                defaultIcon={{
                    path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    strokeOpacity: 0,
                    fillColor: '#0e860e',
                    fillWeight: 5,
                    fillOpacity: .5,
                    scale: 5,
                }}
                label={{
                    text: ((label || region) && 'View from ' + (label || MAP_REGIONS[region] || region)),
                    // fontSize: '20px',
                }}
                position={{lat: center[0], lng: center[1]}}
                onClick={() => setView({group, region, center, zoom})}
            />
        );
    };

    const MapContainer = withScriptjs(withGoogleMap(() => (
        <GoogleMap
            ref={_map => map = _map}
            defaultZoom={zoom}
            defaultCenter={{lat: center[0], lng: center[1]}}
            defaultOptions={{
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                styles: MAP_STYLES,
            }}
        >
            {Object.entries(MAP_GROUPS).map(([id, info]) => (
                <RegionZone
                    key={id}
                    label={info.name}
                    group={id}
                    radius={info.radius}
                    center={info.center}
                    zoom={info.zoom}/>
            ))}

            {/*<PerspectiveMarker group="crimea" region="US" center="44;31" zoom={6} label="U.S.A."/>*/}
            <PerspectiveMarker group="crimea" region="RU" center="45.2;36.5" zoom={6} label="Russia"/>
            <PerspectiveMarker group="crimea" region="UA" center="46.8;33.8" zoom={6}/>

            <PerspectiveMarker group="jammu_kashmir" region="PK" center="31;70.5" zoom={5}/>
            <PerspectiveMarker group="jammu_kashmir" region="IN" center="28;78" zoom={5}/>
            <PerspectiveMarker group="jammu_kashmir" region="CN" center="37;82" zoom={5}/>
        </GoogleMap>
    )));

    let mapParams = {
        v: '3',
        key: 'AIzaSyDR0vaDE6YsHb5MXdBeO9VjujgrM4ic8eQ',
        libraries: 'geometry,drawing,places',
        region,
    };

    let regionOptions = Object.entries(MAP_REGIONS).map(([value, label]) => ({value, label}));

    let groupInfo = MAP_GROUPS[group];

    let mobile = window.innerWidth < 800;
    let width = !mobile ? 300 : null;
    let height = width ? '100vh' : null;

    return (
        <div className="d-flex flex-column flex-md-row" style={{background: '#222'}}>
            {(!detail || !mobile) && (
                <div className="p-2" style={{minWidth: width, width, height}}>
                    <div className="mt-1">
                        <Select
                            className="w-100"
                            options={regionOptions}
                            defaultValue={regionOptions.find(({value}) => region === value)}
                            isClearable={true}
                            placeholder="Choose a perspective..."
                            onChange={opt => setView({
                                region: opt && opt.value,
                                ...getMapParams(),
                            })}
                        />
                    </div>
                    {groupInfo ? (<>
                        <ul className="list-group mt-3 mb-2">
                            {groupInfo.regions && groupInfo.regions.map(id => (
                                <li key={id}
                                    className={classNames('list-group-item noselect clickable', region === id && 'pl-3')}
                                    style={{opacity: region === id && .5}}
                                    onClick={() => setView({region: id, ...getMapParams()})}>
                                    <h5 className={classNames('mb-0', 'text-' + (region === id ? 'white-50' : 'success'))}>
                                        {MAP_REGIONS[id] || id}
                                    </h5>
                                </li>
                            ))}
                        </ul>
                    </>) : (<>
                        <div className="m-5 pl-4 d-none d-md-block">
                            <FaArrowUp className="text-dark" size={100}/>
                        </div>
                        <div className="px-2 mt-4 noselect">
                            <h3 className="text-white">Does <span className="text-warning">Google Maps</span> spread
                                propaganda?</h3>
                            <h4 className="text-white-50">View borders from different countries and decide for
                                yourself.</h4>
                        </div>
                    </>)}
                </div>
            )}
            {detail ? (
                <div className="d-flex flex-column" style={{maxHeight: '100vh'}}>
                    <div className="h4 mb-0 p-4 w-100 text-body"
                         style={{background: '#1A1A1A', lineHeight: 1.5, overflowY: 'auto'}}>
                        <p>
                            In order to appeal to everyone, Google Maps draws national borders
                            differently based on your location.
                        </p>
                        <p className="text-success">
                            Clever, right?
                        </p>
                        <p>
                            Unfortunately, this feature has political consequences. In 2010, a misplaced
                            border between Nicaragua and Costa Rica almost caused an armed conflict known as the <Link
                            href="https://opinionator.blogs.nytimes.com/2012/02/28/the-first-google-maps-war/">"First
                            Google Maps War."</Link>
                        </p>
                        <p className="text-success">
                            Mistakes happen.
                        </p>
                        <p>
                            During the 2014 annexation of Crimea, <Link
                            href="https://apnews.com/article/dfe637594e36792a2b89b66134ccde0e">the Russian government
                            threatened legal action</Link> until Google started showing the contested peninsula as part
                            of
                            Russia.
                        </p>
                        <p>
                            Likewise, Google Maps does not acknowledge the Jammu and Kashmir border conflict (<Link
                            href="https://www.amnesty.org/en/countries/asia-and-the-pacific/india/report-india/">known
                            for its violence and human rights abuses</Link>) when viewed from India.
                        </p>
                        <p className="text-success">
                            By remaining neutral and staying out of trouble, does Google Maps enable countries to
                            spread propaganda?
                        </p>
                    </div>
                    <div className="btn btn-lg btn-primary d-block my-3 mx-2 mx-md-0" onClick={() => setDetail(null)}>
                        Back to map
                    </div>
                </div>
            ) : (
                <MapContainer
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?${Object.entries(mapParams).map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&')}`}
                    containerElement={<div className="flex-grow-1"/>}
                    loadingElement={<div style={{width: '100%', height: '100%', minHeight: 300}}/>}
                    mapElement={<div style={{width: '100%', height: '100%', minHeight: 300}}/>}
                />
            )}
            {(!detail || !mobile) && (
                <div className="p-2 mt-2 mt-md-0" style={{minWidth: width, width, height}}>
                    {groupInfo ? (<>
                    <span
                        className="btn btn-lg btn-primary px-2 pt-0 pb-1 rounded-0 float-right"
                        onClick={() => setView({}, true)}>
                        <FaTimes/>
                    </span>
                        <h3 className="ml-1 text-info noselect">{groupInfo.name}</h3>
                        <div className="px-2">
                            {groupInfo.description}
                        </div>
                    </>) : (<>
                        <h4 className="ml-1 text-muted noselect">Show a dispute:</h4>
                        <ul className="list-group mt-3 mb-2">
                            {Object.entries(MAP_GROUPS).map(([id, info]) => (
                                <li key={id}
                                    className={classNames('list-group-item noselect clickable', group === id && 'pl-3')}
                                    style={{opacity: group === id && .5}}
                                    onClick={() => setView({
                                        group: id,
                                        // region: info.region,
                                        center: info.center,
                                        zoom: info.zoom,
                                    })}>
                                    <h5 className={classNames('mb-0', 'text-' + (region === id ? 'white-50' : 'info'))}>
                                        {info.name}
                                    </h5>
                                </li>
                            ))}
                        </ul>
                        <div
                            className={classNames('m-4 m-md-5 py-2 text-center clickable', detail ? 'text-white' : 'text-muted')}
                            onClick={() => setDetail(detail === 'summary' ? null : 'summary')}>
                            <FaQuestionCircle size={50}/>
                        </div>
                    </>)}
                </div>
            )}
        </div>
    );
};
