import React, { useMemo } from 'react'
import { observer } from 'mobx-react'
import ReactMapboxGl, { Layer, Feature, Popup } from 'react-mapbox-gl'

import { classNamesPrefix } from 'utils/react'

import state from 'state'

import { useLayoutConfig, useCallback } from 'hooks'

import SEO from 'components/layout/seo'
import { IconMap } from 'components/shared/icons'

import './map.scss'

const block = 'page-map'
const cx = classNamesPrefix(block)

const PageDrivers = observer(({ location } : { location: any }) => {

    const Map = useMemo(() => ReactMapboxGl({
        accessToken: state.configuration.mapbox.accessToken,
    }), [state.configuration.mapbox.accessToken])

    useLayoutConfig({
        topBar: {
            titleIcon: IconMap,
            title: 'Carte',
        },
    })

    const [center] = React.useState<[number, number]>([2.354178, 48.865711])
    const [zoom] = React.useState<[number]>([11])
    const [mapRef] = React.useState<any>({ map: null });
    const [popup, setPopup] = React.useState<any>({ show: false })

    const onMapVehicleClick = useCallback((e: any, id: string) => {
        e.originalEvent.preventDefault()
        state.vehicles.selectVehicle(id)
        setPopup({ ...popup, show: true })
    }, [])

    return (
        <section id="page-map" className={block}>
            <SEO title='Carte' />
            <div className={cx('__content')}>
                <Map
                    center={center}
                    zoom={zoom}
                    style="mapbox://styles/fleeters/ckemn2mg92ftp1at2bc37clen"
                    containerStyle={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 'calc(100% - 200px)',
                        height: '100%',
                    }}
                    onStyleLoad={(map: any) => mapRef.map = map}
                    onMouseDown={(e, f) => setPopup({ ...popup, show: false }) }
                >

                    { /* Online vehicles layer */ }
                    <Layer
                        id="online"
                        type="symbol"
                        layout={{
                            "icon-image": "icon-map-circle-green",
                            'icon-allow-overlap': true,
                            'icon-anchor': 'bottom',
                        }}
                    >
                        {/* FIXME */ }
                    </Layer>

                    { /* Offline vehicles layer */ }
                    <Layer
                        id="offline"
                        type="symbol"
                        layout={{
                            "icon-image": "icon-map-circle-red",
                            'icon-allow-overlap': true,
                            'icon-anchor': 'bottom',
                        }}
                    >
                        {/* FIXME */ }
                    </Layer>

                    { /* Popup */ }
                    {
                        popup.show && (
                            <Popup
                                onClick={() => setPopup({ ...popup, show: false })}
                                onMouseEnter={() => mapRef.map.getCanvas().style.cursor = 'pointer'}
                                onMouseLeave={() => mapRef.map.getCanvas().style.cursor = ''}
                                coordinates={[
                                    state.vehicles.selectedVehicle!.location[1],
                                    state.vehicles.selectedVehicle!.location[0]
                                ]}
                                className={cx('__popup')}
                                offset={{
                                    'bottom-left': [12, -38],  'bottom': [0, -20], 'bottom-right': [-12, -38]
                                }}
                            >
                                <h1>{state.vehicles.selectedVehicle?.name}</h1>
                            </Popup>
                        )
                    }

                </Map>

                <div className={cx('__sidebar')}>
                    <h2 className={cx('__title')}>Véhicules</h2>
                    <div className={cx('__list')}>
                        {/* FIXME */ }
                    </div>
                </div>

            </div>
        </section>
    )
})

export default PageDrivers
