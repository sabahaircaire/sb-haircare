-- SB Haircare — Seed data : missions par défaut + wash day flows

------------------------------------------------------------
-- Missions library
------------------------------------------------------------
insert into public.missions (code, title, description, xp_reward, category) values
  ('hydrate_pointes',     'Hydrater les pointes',         'Applique un leave-in ou une huile sur les pointes', 10, 'hydration'),
  ('massage_cuir_chevelu','Massage du cuir chevelu',      'Massage 3-5 min pour stimuler la circulation',       15, 'scalp'),
  ('bonnet_satin',        'Bonnet satin pour la nuit',    'Dors avec ton bonnet ou taie d''oreiller satin',    10, 'protection'),
  ('boire_eau',           'Hydratation interne',          '1.5L d''eau aujourd''hui',                            5, 'hydration'),
  ('demeler_doigts',      'Démêler aux doigts',           'Démêle doucement section par section',               10, 'protection'),
  ('huile_pre_poo',       'Pré-poo à l''huile',           'Bain d''huile avant ton wash day',                  20, 'hydration'),
  ('rincage_froid',       'Rinçage à l''eau froide',      'Scelle l''hydratation avec un rinçage froid',       10, 'hydration'),
  ('eviter_chaleur',      'Pas de chaleur aujourd''hui',  'Aucun outil chauffant',                              10, 'protection');

------------------------------------------------------------
-- Wash day flows
------------------------------------------------------------
insert into public.wash_day_flows (code, title, description, total_duration_min, cadence, steps) values
  ('jour_de_lavage',
   'Jour de lavage',
   'Routine de lavage complète : pré-poo, shampoing, après-shampoing, hydratation, coiffure',
   30,
   'every_2_weeks',
   '[
     {"order":1,"title":"Pré-poo","duration_min":30,"instructions":"Sur cheveux démêlés et hydratés, appliquez votre pré-poo et laissez agir au moins 30 minutes.","suggestion":"Avant de laver, démêlez doucement avec les doigts ou un peigne à dents larges. Commencez par les pointes."},
     {"order":2,"title":"Lavage","duration_min":3,"instructions":"Lavez vos cheveux en sections, en insistant sur le cuir chevelu et les racines."},
     {"order":3,"title":"Après-shampoing","duration_min":10,"instructions":"Rincez puis appliquez l''après-shampoing sur les longueurs et pointes.","suggestion":"Si besoin, utilisez plutôt un soin profond."},
     {"order":4,"title":"LOC ou LCO","duration_min":10,"instructions":"Rincez puis coiffez avec la méthode LOC ou LCO.","reminder":"Rincez puis coiffez avec LOC ou LCO"},
     {"order":5,"title":"Séchage étiré","duration_min":5,"instructions":"Mettez chaque section en vanilles/tresses pour sécher étiré.","reminder":"Mettez chaque section en vanilles/tresses pour sécher étiré"}
   ]'::jsonb),

  ('bain_huile',
   'Rituel bain d''huile',
   'Pré-poo profond à l''huile chaude pour nourrir les longueurs',
   45,
   'monthly',
   '[
     {"order":1,"title":"Préparer l''huile","duration_min":5,"instructions":"Faites tiédir un mélange d''huile de coco, ricin et amande douce."},
     {"order":2,"title":"Application section par section","duration_min":10,"instructions":"Appliquez généreusement sur cheveux secs, des racines aux pointes."},
     {"order":3,"title":"Laisser poser","duration_min":30,"instructions":"Couvrez d''un bonnet chauffant ou serviette chaude.","suggestion":"Profitez-en pour boire un thé."}
   ]'::jsonb),

  ('masque_ayurvedique',
   'Masque ayurvédique',
   'Mélange de poudres indiennes : Bringaraj, Brahmi, Fenugrec, Hibiscus, Guimauve',
   60,
   'monthly',
   '[
     {"order":1,"title":"Mélange","duration_min":5,"instructions":"Mélangez 3 à 4 cuillères à soupe de poudre avec un liquide chaud (eau, lait végétal, hydrolat)."},
     {"order":2,"title":"Application","duration_min":10,"instructions":"Appliquez sur cheveux propres et humides, du cuir chevelu aux pointes."},
     {"order":3,"title":"Pose sous chaleur","duration_min":40,"instructions":"Couvrez d''un bonnet chauffant. Laissez poser 30 à 60 min.","reminder":"Rincez abondamment à la fin"},
     {"order":4,"title":"Rinçage","duration_min":5,"instructions":"Rincez très abondamment puis appliquez après-shampoing si besoin."}
   ]'::jsonb),

  ('hydrater',
   'Hydrater',
   'Routine express d''hydratation entre les wash days',
   10,
   'as_needed',
   '[
     {"order":1,"title":"Vaporiser","duration_min":2,"instructions":"Vaporisez un mélange eau + jus d''aloe vera sur les longueurs."},
     {"order":2,"title":"Leave-in","duration_min":3,"instructions":"Appliquez un leave-in crème en sections."},
     {"order":3,"title":"Sceller","duration_min":3,"instructions":"Scellez avec une huile légère sur les longueurs et pointes."},
     {"order":4,"title":"Recoiffer","duration_min":2,"instructions":"Recoiffez en vanilles ou bantu knots pour la nuit."}
   ]'::jsonb),

  ('remise_en_forme_cuir_chevelu',
   'Remise en forme du cuir chevelu',
   'Massage rapide pour relancer la circulation',
   5,
   'as_needed',
   '[
     {"order":1,"title":"Huile pour le cuir chevelu","duration_min":1,"instructions":"Quelques gouttes d''huile (jojoba, ricin) directement sur le cuir chevelu."},
     {"order":2,"title":"Massage","duration_min":3,"instructions":"Massez en cercles avec le bout des doigts, sans frotter avec les ongles."},
     {"order":3,"title":"Étirements","duration_min":1,"instructions":"Pincez et soulevez doucement le cuir chevelu pour relâcher les tensions."}
   ]'::jsonb),

  ('dormir_satin',
   'Dormir en satin',
   'Routine du soir pour préserver tes longueurs',
   5,
   'as_needed',
   '[
     {"order":1,"title":"Recoiffer","duration_min":2,"instructions":"Recoiffe en grosses vanilles, ananas, ou bantu knots selon la longueur."},
     {"order":2,"title":"Bonnet satin","duration_min":1,"instructions":"Couvre tes cheveux d''un bonnet ou foulard satin/soie."},
     {"order":3,"title":"Taie d''oreiller","duration_min":2,"instructions":"Vérifie que ta taie d''oreiller est en satin/soie en backup."}
   ]'::jsonb);
