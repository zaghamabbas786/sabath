import { SymptomCategoryType } from './types';

export const SYMPTOM_CATEGORIES: SymptomCategoryType[] = [
  {
    id: 'head',
    label: 'HEAD & BRAIN',
    options: [
      'Headaches / migraines',
      'Brain fog / confusion',
      'Dizziness / vertigo',
      'Insomnia / nightmares',
      'Jaw tension / TMJ',
      'Eyes (strain, blurred vision)',
      'Ears (ringing, infection)',
      'Sinus pressure / allergies'
    ]
  },
  {
    id: 'throat',
    label: 'THROAT & NECK',
    options: [
      'Sore throat / tightness',
      'Neck pain / stiffness',
      'Thyroid concerns',
      'Swallowing difficulty',
      'Voice strain / hoarseness',
      'Lymph swelling'
    ]
  },
  {
    id: 'chest',
    label: 'CHEST / HEART / LUNGS',
    options: [
      'Chest tightness / anxiety',
      'Heart palpitations',
      'Shortness of breath',
      'Asthma / bronchial strain',
      'Chronic cough',
      'Grief heaviness in chest'
    ]
  },
  {
    id: 'shoulders',
    label: 'SHOULDERS / UPPER BACK / ARMS',
    options: [
      'Shoulder tension',
      'Upper back tightness',
      'Arm numbness / tingling',
      'Wrist / hand pain',
      'Carpal tunnel',
      'Elbow pain'
    ]
  },
  {
    id: 'stomach',
    label: 'STOMACH / DIGESTION',
    options: [
      'Nausea',
      'Reflux / GERD',
      'Ulcers / burning',
      'Bloating',
      'IBS / spasms',
      'Appetite loss / overeating',
      'Food sensitivity stress'
    ]
  },
  {
    id: 'lower_back',
    label: 'LOWER BACK / HIPS / PELVIS',
    options: [
      'Lower back pain',
      'Sciatica',
      'Hip stiffness',
      'Tailbone pain',
      'Pelvic floor tension',
      'Posture strain'
    ]
  },
  {
    id: 'kidneys',
    label: 'KIDNEYS / BLADDER / FLUID',
    options: [
      'UTI / bladder irritation',
      'Kidney pain',
      'Water retention',
      'Frequent urination',
      'Dehydration cycles'
    ]
  },
  {
    id: 'reproductive',
    label: 'REPRODUCTIVE / SEXUAL HEALTH',
    options: [
      'Menstrual pain / irregularity',
      'Fertility concerns',
      'Pregnancy / postpartum stress',
      'Sexual pain / low desire',
      'Shame or fear in intimacy'
    ]
  },
  {
    id: 'legs',
    label: 'LEGS / KNEES',
    options: [
      'Knee pain',
      'Restless legs',
      'Weakness / heaviness',
      'Circulation discomfort',
      'Muscle tension'
    ]
  },
  {
    id: 'feet',
    label: 'FEET / ANKLES',
    options: [
      'Foot pain / plantar strain',
      'Ankle instability',
      'Swelling',
      'Numbness / cold feet'
    ]
  },
  {
    id: 'skin',
    label: 'SKIN / IMMUNE',
    options: [
      'Rashes / eczema',
      'Acne / inflammation',
      'Autoimmune flares',
      'Frequent sickness',
      'Allergies',
      'Slow healing'
    ]
  },
  {
    id: 'chronic',
    label: 'WHOLE-BODY / CHRONIC',
    options: [
      'Chronic fatigue',
      'Widespread pain',
      'Long-term inflammation',
      '"No clear diagnosis"',
      'Trauma after injury'
    ]
  }
];


