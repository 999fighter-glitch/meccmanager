/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
}

export const PPP_LIST: PPPContact[] = [
  // CONTACT PPP PHC HTAR
  { id: 'h1', name: 'ABD RAHMAN', personalPhone: '0122570293', category: 'PHC HTAR' },
  { id: 'h2', name: 'AFENDI', personalPhone: '0195355381', category: 'PHC HTAR' },
  { id: 'h3', name: 'AIMAN', personalPhone: '01123337183', category: 'PHC HTAR' },
  { id: 'h4', name: 'AKMAL', personalPhone: '0183101074', category: 'PHC HTAR' },
  { id: 'h5', name: 'ALHAFIS', personalPhone: '01111904435', category: 'PHC HTAR' },
  { id: 'h6', name: 'ALIF', personalPhone: '0172903369', category: 'PHC HTAR' },
  { id: 'h7', name: 'ALLIMIN', personalPhone: '0197931994 / 0183374480', category: 'PHC HTAR' },
  { id: 'h8', name: 'AMIR', personalPhone: '0197064116', category: 'PHC HTAR' },
  { id: 'h9', name: 'AMIRUN', personalPhone: '0132214273', category: 'PHC HTAR' },
  { id: 'h10', name: 'AZRI', personalPhone: '0145328221', category: 'PHC HTAR' },
  { id: 'h11', name: 'AZWAN', personalPhone: '0172737381', category: 'PHC HTAR' },
  { id: 'h37', name: 'BALKIS', personalPhone: '0103609499', category: 'PHC HTAR' },
  { id: 'h12', name: 'CALEMENT', personalPhone: '0138675395', category: 'PHC HTAR' },
  { id: 'h41', name: 'DANIAL', personalPhone: '0167687238', category: 'PHC HTAR' },
  { id: 'h13', name: 'ERNA', personalPhone: '0143958647', category: 'PHC HTAR' },
  { id: 'h14', name: 'FAKRURUZEE', personalPhone: '0199962284', category: 'PHC HTAR' },
  { id: 'h15', name: 'FLORINA', personalPhone: '0195832878', category: 'PHC HTAR' },
  { id: 'h16', name: 'HAAZIM', personalPhone: '01110203938', category: 'PHC HTAR' },
  { id: 'h17', name: 'HADI', personalPhone: '01111414718', category: 'PHC HTAR' },
  { id: 'h18', name: 'HAFIZUDIN', personalPhone: '0139404065', category: 'PHC HTAR' },
  { id: 'h42', name: 'HAFIZZAT', personalPhone: '0185760902', category: 'PHC HTAR' },
  { id: 'h19', name: 'HAMID', personalPhone: '0145327239', category: 'PHC HTAR' },
  { id: 'h20', name: 'HAZIQ', personalPhone: '0174344688', category: 'PHC HTAR' },
  { id: 'h21', name: 'HUZAIMEE', personalPhone: '01117645031', category: 'PHC HTAR' },
  { id: 'h22', name: 'IMRAN', personalPhone: '0129594215', category: 'PHC HTAR' },
  { id: 'h23', name: 'KAMARUL', personalPhone: '0145356522', category: 'PHC HTAR' },
  { id: 'h24', name: 'MEDILITA', personalPhone: '0145506096', category: 'PHC HTAR' },
  { id: 'h25', name: 'MUHAIMIN', personalPhone: '0199157211', category: 'PHC HTAR' },
  { id: 'h26', name: 'NABIL', personalPhone: '0132586709', category: 'PHC HTAR' },
  { id: 'h38', name: 'NAWICH', personalPhone: '0128436856', category: 'PHC HTAR' },
  { id: 'h27', name: 'NAZMI', personalPhone: '0137387823', category: 'PHC HTAR' },
  { id: 'h28', name: 'NELSON', personalPhone: '0145606563', category: 'PHC HTAR' },
  { id: 'h29', name: 'NORHISHAM', personalPhone: '0199277009', category: 'PHC HTAR' },
  { id: 'h30', name: 'PATLOB', personalPhone: '01125205737', category: 'PHC HTAR' },
  { id: 'h31', name: 'SHAFIQ (HTAR)', personalPhone: '0199477037', category: 'PHC HTAR' },
  { id: 'h39', name: 'STONE', personalPhone: '0135546764', category: 'PHC HTAR' },
  { id: 'h32', name: 'SYAFIQ (HTAR)', personalPhone: '0198328266', category: 'PHC HTAR' },
  { id: 'h33', name: 'SYAHRUL IKRAM', personalPhone: '01139829202', category: 'PHC HTAR' },
  { id: 'h40', name: 'SYAZWANI', personalPhone: '01114356298', category: 'PHC HTAR' },
  { id: 'h34', name: 'WAN MOHD RIDZUAN', personalPhone: '0183920125', category: 'PHC HTAR' },
  { id: 'h35', name: 'ZAFIR', personalPhone: '0146646277', category: 'PHC HTAR' },
  { id: 'h36', name: 'ZULHAKIMI', personalPhone: '0145102058', category: 'PHC HTAR' },
  
  // KK KAPAR
  { id: 'k1', name: 'IZWAN', personalPhone: '0134514775', category: 'KK KAPAR' },
  { id: 'k2', name: 'FAZI', personalPhone: '0199505634', category: 'KK KAPAR' },
  { id: 'k3', name: 'SHAFIQ (KAPAR)', personalPhone: '0166549939', category: 'KK KAPAR' },
  { id: 'k4', name: 'ZAHIR', personalPhone: '0145182583', category: 'KK KAPAR' },
  { id: 'k5', name: 'WAFI', personalPhone: '0105737303', category: 'KK KAPAR' },

  // KK MERU
  { id: 'm1', name: 'LUQMAN', personalPhone: '0173895692', category: 'KK MERU' },
  { id: 'm2', name: 'NIZAM', personalPhone: '0176391567', category: 'KK MERU' },
  { id: 'm3', name: 'SYAFIQ ROSLAN', personalPhone: '01135258253', category: 'KK MERU' },
  { id: 'm4', name: 'SYAFIQ ABDOL', personalPhone: '0135174002', category: 'KK MERU' },

  // KK P.INDAH
  { id: 'pi1', name: 'SULAIMAN', personalPhone: '0136283282', category: 'KK P.INDAH' },
  { id: 'pi2', name: 'MUSTAKIM', personalPhone: '0195779107', category: 'KK P.INDAH' },
  { id: 'pi3', name: 'NAIM', personalPhone: '0137740846', category: 'KK P.INDAH' },
];

export const STJOHN_RESPONDERS = [
  'AFIQ',
  'ASYRAF',
  'AZIM',
  'FAIZZAT',
  'HAZIQ',
  'LEE',
  'LOGAN HARIRI',
  'SHAM',
  'STEEL',
  'YONG',
  'ZALI'
];

export const AMBULANCE_TEAMS: AmbulanceTeam[] = [
  { id: 'htar1', name: 'HTAR_1_Sel_H', tmPhone: '01162621438', defaultStatus: true },
  { id: 'htar2', name: 'HTAR_2_Sel_H', tmPhone: '01162621432', defaultStatus: true },
  { id: 'htar3', name: 'HTAR_3_Sel_H', tmPhone: '01162621451', defaultStatus: true },
  { id: 'htar4', name: 'HTAR_4_Sel_H', tmPhone: '01162619400', defaultStatus: true },
  { id: 'pulauindah1', name: 'Pulau indah_1_Sel_KK', tmPhone: '01162616949', defaultStatus: true },
  { id: 'kkkapar1', name: 'KK_Kapar_1_Sel_KK', tmPhone: '01162619655', defaultStatus: true },
  { id: 'meru1', name: 'Meru_1_Sel_KK', tmPhone: '01162620457', defaultStatus: true },
  { id: 'stjohn4', name: 'St. John_4_Sel_KK', tmPhone: '01162619488', defaultStatus: true },
  { id: 'anika1', name: 'Anika_1_Sel_KK', tmPhone: '01162619500', defaultStatus: false },
  { id: 'botanik1', name: 'Botanik_1_Sel_KK', tmPhone: '01162619511', defaultStatus: false },
  { id: 'bukitkuda1', name: 'Bukit Kuda_1_Sel_H', tmPhone: 'N/A', defaultStatus: false },
  { id: 'bukitnaga1', name: 'Bukit Naga_1_Sel_H', tmPhone: 'N/A', defaultStatus: false },
  { id: 'pandamaran1', name: 'Pandamaran _1_Sel_KK', tmPhone: '01162621865', defaultStatus: false },
  { id: 'portklang1', name: 'Port klang_1_Sel_KK', tmPhone: '01162616944', defaultStatus: false },
  { id: 'rantaupanjang1', name: 'Rantau Panjang_1_Sel_KK', tmPhone: '01162616971', defaultStatus: false },
];

export type Shift = 'AM' | 'PM' | 'ON';

export const SHIFT_DETAILS: Record<Shift, { label: string; time: string }> = {
  AM: { label: 'AM', time: '0700-1400' },
  PM: { label: 'PM', time: '1400-2100' },
  ON: { label: 'ON', time: '2100-0700' },
};
