-- Create FAQs table
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view published FAQs"
ON public.faqs
FOR SELECT
USING (is_published = true);

CREATE POLICY "Authenticated users can manage FAQs"
ON public.faqs
FOR ALL
USING (auth.role() = 'authenticated'::text);

-- Insert initial FAQs from the document
INSERT INTO public.faqs (question, answer, display_order, is_published) VALUES
('What is the German Exiles Rugby League Club?', 'The German Exiles Rugby League exists to provide a pathway for German-heritage players to represent Germany and to develop rugby league at all levels throughout the country. Our mission is to build a sustainable future for the sport in Germany through our heritage, community, and development programmes.', 1, true),
('What is the NRLD?', 'The NRLD (Nationaler Rugby League Deutschland) is the official governing body for Rugby League in Germany. It oversees all domestic competitions, player development programmes, and rugby league initiatives across the country. The NRLD is also responsible for the selection and management of the German National Rugby League Team. The German Exiles Rugby League serves as a heritage pathway, providing eligible players who may be considered for national team selection by the NRLD.', 2, true),
('What is the Kaiser Cup?', 'The Kaiser Cup is the flagship annual fixture of the German Exiles Rugby League calendar. It is contested between the German Exiles and the top 18 players from the German domestic competition, regardless of their international eligibility status. The fixture is designed to showcase the best German Rugby League talent and strengthen the connection between the domestic and heritage pathways. The Kaiser Cup is played annually, alternating each year between venues in Germany and the United Kingdom.', 3, true),
('Who can join the club or play for the team?', 'To represent the German Exiles Rugby League, players must meet one of the following eligibility criteria: Hold a German passport or citizenship, be a German national, be born in Germany, or provide proof of German heritage that can be traced back up to two generations (grandparents) in accordance with ERL and IRL rules. Community Players with links to Germany can also train and participate even if not eligible for the national team.', 4, true),
('Where and when do you train / hold games?', 'Training camps are posted under the "News" section. Most are held at Sharlston Rovers, east of Wakefield. Any changes will be stated in the article and invitation. Registration in advance is required.', 5, true),
('Do I need to pay a membership or subscription fee?', 'There is no club subscription fee. All players must be registered with the RFL and have annual insurance paid. If already registered with an RFL club, you''re covered. Otherwise, the Exiles can register you, but you must pay the insurance fee. Each player is expected to have a £250 player sponsor to cover tour funding and kit.', 6, true),
('What kind of matches or fixtures does the club play?', 'We play exhibition matches across the UK and Europe. Each year, we organise a fully funded European tour for 20 selected players. Only 100% confirmed fixtures appear online.', 7, true),
('How can I follow your results and news?', 'Follow us on Facebook (German Exiles Rugby League) and Instagram (@germanexilesrl) for news, results, and updates.', 8, true),
('Do you have a club shop or kit I can buy?', 'Yes — our official club shop, managed by Pronto Team Wear, is linked from our website.', 9, true),
('How can I become a sponsor or get involved in supporting the club?', 'We offer Player, Main, Ball, and Match Day Sponsor packages. Sponsorship helps fund training, tours, and development. Contact zak@germanexilesrl.co.uk for details.', 10, true),
('Where is the club based / where do you play your home games?', 'Our official base is at Sharlston Rovers, near Wakefield. All home fixtures are played there unless otherwise stated. The exception is the Kaiser Cup, held at a professional venue.', 11, true),
('I don''t have any experience playing rugby league – can I still join?', 'All players are welcome to give the Exiles a shot, but our fixtures are representative level. A high fitness and skill level is required. Attend an open training camp to experience the standard and get feedback.', 12, true),
('What is expected of me?', 'All players must follow the German Exiles Rugby League Code of Behaviour and coaching team standards. We expect commitment, respect, teamwork, and discipline on and off the field.', 13, true),
('How can I contact you for more info?', 'Email zak@germanexilesrl.co.uk or reach out via our website contact form and social media channels (Facebook & Instagram).', 14, true);