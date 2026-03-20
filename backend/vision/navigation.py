"""Navigation helper functions for directional guidance."""
from random import choice

DIRECTIONS = ["left", "right", "forward", "obstacle"]


def get_navigation_direction() -> str:
    """Return simulated navigation direction."""
    return choice(DIRECTIONS)


def get_location_from_bbox(x1: int, x2: int, frame_width: int) -> str:
    """Map bounding-box center position to left/front/right."""
    center = (x1 + x2) / 2
    if center < frame_width / 3:
        return "left"
    if center > (2 * frame_width / 3):
        return "right"
    return "front"
