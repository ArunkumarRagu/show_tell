from typing import Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.settings import SystemSettingsModel

DEFAULT_SETTINGS = {
    "competitionName": "HAT Converse",
    "allowSelfRegistration": False,
    "maxTeamSize": 10,
    "defaultPassingScore": 60,
    "enableLeaderboard": True
}

class SettingsRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> Dict[str, Any]:
        setting = self.db.scalar(select(SystemSettingsModel).where(SystemSettingsModel.key == "global"))
        if not setting:
            setting = SystemSettingsModel(key="global", value=DEFAULT_SETTINGS)
            self.db.add(setting)
            self.db.commit()
            self.db.refresh(setting)
        return setting.value

    def update(self, new_settings: Dict[str, Any]) -> Dict[str, Any]:
        setting = self.db.scalar(select(SystemSettingsModel).where(SystemSettingsModel.key == "global"))
        if not setting:
            setting = SystemSettingsModel(key="global", value=DEFAULT_SETTINGS)
            self.db.add(setting)

        current = dict(setting.value or DEFAULT_SETTINGS)
        current.update(new_settings)
        setting.value = current
        self.db.commit()
        self.db.refresh(setting)
        return setting.value
