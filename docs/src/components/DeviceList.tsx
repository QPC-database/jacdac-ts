
import React, { useContext } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import DeviceCard from './DeviceCard';
import ServiceCard from './ServiceCard';
import useChange from '../jacdac/useChange';
import JacdacContext from '../../../src/react/Context';
import { toHex } from '../../../src/dom/utils';

const useStyles = makeStyles({
    root: {
        marginBottom: "1rem"
    },
});

export default function DeviceList(props: {
    serviceClass?: number,
    linkToService?: boolean,
    registerIdentifier?: number,
    eventIdentifier?: number,
    commandIdentifier?: number,
    showDeviceName?: boolean,
    showServiceName?: boolean,
    showRegisterName?: boolean,
    showTemperature?: boolean,
    showFirmware?: boolean
}) {
    const { serviceClass, linkToService, registerIdentifier, showDeviceName, showServiceName, showRegisterName, eventIdentifier, commandIdentifier, showFirmware, showTemperature } = props
    const { bus } = useContext(JacdacContext)
    const devices = useChange(bus, n => n.devices({ serviceClass }))
    const classes = useStyles()
    const hasServiceClass = serviceClass !== undefined

    return (
        <Grid
            container
            spacing={2}
            className={classes.root}
        >
            {!hasServiceClass && devices.map(device => <Grid key={device.id} item xs={4}><DeviceCard device={device} showTemperature={showTemperature} showFirmware={showFirmware} /></Grid>)}
            {hasServiceClass && devices.map(device => device.services({ serviceClass }).map(service => {
                return <Grid key={service.id} item xs={4}>
                    <ServiceCard service={service}
                        linkToService={linkToService}
                        showDeviceName={showDeviceName}
                        showServiceName={showServiceName}
                        showMemberName={showRegisterName}
                        registerIdentifier={registerIdentifier}
                        eventIdentifier={eventIdentifier}
                        commandIdentifier={commandIdentifier}
                        />
                </Grid>
            }))}
        </Grid>
    )
}
