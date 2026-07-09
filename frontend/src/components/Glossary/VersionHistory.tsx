import React, { useState, useEffect } from 'react';
import type { Versions } from '../../types';

interface VersionHistoryProps {
  version_history: Versions[];
  selectedVersion: number | null
  onVersionSelect: (versionNumber: number) => void;
  isLoading: boolean;
}

const VersionHistory = ({ version_history, selectedVersion, onVersionSelect, isLoading }: VersionHistoryProps) => {
  return (
    <select
      value={selectedVersion || ''}
      onChange={(e) => {
        onVersionSelect(parseInt(e.target.value));
      }}
      disabled={isLoading}
    >
      {version_history.map((version) => (
        <option
          key={version.version_number}
          value={version.version_number}
        >
          {version.is_current ? '📌 ' : ''}Ver. {version.version_number}
        </option>
      ))}
    </select>
  )
}

export default VersionHistory