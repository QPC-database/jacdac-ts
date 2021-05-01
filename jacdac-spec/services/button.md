# Button

    identifier: 0x1473a263
    extends: _sensor
    group: button
    tags: C, 8bit

A push-button, which returns to inactive position when not operated anymore.

## Registers

    ro pressure: u0.16 / @ reading

Indicates the pressure state of the button, where ``0`` is open and ``0xffff`` is fully pressed.

    const analog?: bool @ 0x180

Indicates if the button provides analog ``pressure`` readings.

## Events

    event down @ active

Emitted when button goes from inactive to active.

    event up @ inactive { 
        time: u32 ms 
    } 

Emitted when button goes from active to inactive. The 'time' parameter 
records the amount of time between the down and up events.

    event hold @ 0x81 {
         time: u32 ms
    }

Emitted when the press time is greater than 500ms, and then at least every 500ms 
as long as the button remains pressed. The 'time' parameter records the the amount of time
that the button has been held (since the down event).
