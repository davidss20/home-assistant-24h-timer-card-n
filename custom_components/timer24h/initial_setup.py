"""Initial setup helper for Timer 24H integration."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from .coordinator import Timer24HCoordinator

_LOGGER = logging.getLogger(__name__)

DEFAULT_SCHEDULE_SLOTS = [
    False, False, False, False, False, False, False, False, False, False, False, False,  # 00:00-06:00
    False, False, False, False, False, False, False, False, False, False, False, False,  # 06:00-12:00
    False, False, False, False, False, False, False, False, True,  True,  True,  True,   # 12:00-18:00
    True,  True,  True,  True,  True,  True,  False, False, False, False, False, False   # 18:00-24:00
]

async def async_create_initial_schedule_if_needed(
    hass: HomeAssistant, 
    coordinator: Timer24HCoordinator
) -> None:
    """Create an initial demo schedule if no schedules exist."""
    
    # Check if any schedules already exist
    schedules = await coordinator.storage.async_get_all_schedules()
    if schedules:
        _LOGGER.debug("Schedules already exist, skipping initial setup")
        return
    
    # Find a suitable light entity for demo
    entity_registry = er.async_get(hass)
    light_entities = [
        entity.entity_id for entity in entity_registry.entities.values()
        if entity.entity_id.startswith("light.") and not entity.disabled_by
    ]
    
    # If no lights, try switches
    if not light_entities:
        switch_entities = [
            entity.entity_id for entity in entity_registry.entities.values()
            if entity.entity_id.startswith("switch.") and not entity.disabled_by
        ]
        target_entity = switch_entities[0] if switch_entities else "light.example"
    else:
        target_entity = light_entities[0]
    
    try:
        # Create a demo schedule
        await coordinator.async_set_schedule(
            schedule_id="demo_schedule",
            target_entity_id=target_entity,
            slots=DEFAULT_SCHEDULE_SLOTS,
            enabled=True,
            timezone=None
        )
        
        _LOGGER.info(
            "Created initial demo schedule for entity %s. "
            "Schedule is active from 16:00-21:00 (evening hours).",
            target_entity
        )
        
        # Fire a notification event
        hass.bus.async_fire("timer24h_initial_setup", {
            "schedule_id": "demo_schedule",
            "target_entity_id": target_entity,
            "message": f"Timer 24H: Created demo schedule for {target_entity}. Active 16:00-21:00."
        })
        
    except Exception as err:
        _LOGGER.error("Failed to create initial schedule: %s", err)
