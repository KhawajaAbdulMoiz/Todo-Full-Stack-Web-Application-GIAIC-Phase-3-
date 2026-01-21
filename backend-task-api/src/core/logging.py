"""
Logging Module for Backend Services

This module provides centralized logging functionality for the backend services,
including security logging for access attempts as required by the implementation plan.
"""

import logging
import sys
from datetime import datetime
from typing import Optional

# Create a custom logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# Create handlers
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.DEBUG)

# Create formatters and add them to handlers
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
console_handler.setFormatter(formatter)

# Add handlers to the logger
logger.addHandler(console_handler)

def log_security_event(event_type: str, user_id: Optional[str] = None, details: Optional[str] = None):
    """
    Log a security-related event.
    
    Args:
        event_type: Type of security event (e.g., 'access_attempt', 'auth_failure', 'data_access')
        user_id: ID of the user involved in the event (if applicable)
        details: Additional details about the event
    """
    message = f"SECURITY EVENT: {event_type}"
    if user_id:
        message += f" - User: {user_id}"
    if details:
        message += f" - Details: {details}"
    
    logger.info(message)

def log_access_attempt(user_id: str, resource: str, success: bool):
    """
    Log an access attempt to a protected resource.
    
    Args:
        user_id: ID of the user attempting access
        resource: Resource being accessed
        success: Whether the access was granted
    """
    status = "SUCCESS" if success else "FAILURE"
    log_security_event(
        event_type="access_attempt",
        user_id=user_id,
        details=f"Resource: {resource}, Status: {status}"
    )

def log_authentication_event(user_id: Optional[str], success: bool, source_ip: Optional[str] = None):
    """
    Log an authentication event.
    
    Args:
        user_id: ID of the user attempting authentication (if known)
        success: Whether the authentication was successful
        source_ip: IP address of the request (if available)
    """
    status = "SUCCESS" if success else "FAILURE"
    details = f"Status: {status}"
    if source_ip:
        details += f", IP: {source_ip}"
    
    log_security_event(
        event_type="authentication",
        user_id=user_id,
        details=details
    )

def log_data_access(user_id: str, resource_type: str, resource_id: str, action: str):
    """
    Log access to data resources.
    
    Args:
        user_id: ID of the user accessing the data
        resource_type: Type of resource (e.g., 'task', 'conversation', 'message')
        resource_id: ID of the specific resource
        action: Action performed (e.g., 'read', 'update', 'delete')
    """
    log_security_event(
        event_type="data_access",
        user_id=user_id,
        details=f"Resource: {resource_type}/{resource_id}, Action: {action}"
    )