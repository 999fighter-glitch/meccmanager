/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Shift = 'AM' | 'PM' | 'ON';

export interface PPPContact {
  id: string;
  name: string;
  personalPhone: string;
  category: string;
}

export interface AmbulanceTeam {
  id: string;
  name: string;
  tmPhone: string;
  defaultStatus: boolean;
  category?: string;
  vehiclePlate?: string;
}

export type MeccStatusType = 'SIAP_SEDIA' | 'ON_CALL' | 'ROSAK' | 'TIADA_STAFF' | 'OFF';

export interface MeccTeam {
  id: string;
  name: string;
  category: 'PKD BANTING' | 'BANTING' | 'SHAH ALAM' | 'HASA' | string;
  defaultStatus: MeccStatusType;
  defaultVehicle?: string;
  defaultDriver?: string;
  defaultPpp?: string;
  phone?: string;
}

export interface MeccTeamStatus {
  status: MeccStatusType;
  ppp: string;
  driver: string;
  crew?: string;
  vehicle: string;
  notes: string;
}

export interface DetectedManualName {
  id: string;
  type: 'stjohn' | 'ppp';
  name: string;
  selected: boolean;
  stJohnField?: 'manualName1' | 'manualName2';
  teamId?: string;
  teamName?: string;
  category: string;
  phone: string;
}

export type ActiveTab = 'landing' | 'dashboard' | 'poz' | 'mecc' | 'responders' | 'settings';

export interface PozTeamStatusItem {
  active: boolean;
  pppId: string;
  customPppName?: string;
  isOthersPpp?: boolean;
  manualName1?: string;
  manualName2?: string;
  isOthers1?: boolean;
  isOthers2?: boolean;
}
