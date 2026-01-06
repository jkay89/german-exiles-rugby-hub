import { supabase } from "@/integrations/supabase/client";

interface TermsSection {
  section_key: string;
  section_label: string;
  content_type: string;
  content_value: string;
}

const defaultSections: TermsSection[] = [
  {
    section_key: "page_title",
    section_label: "Page Title",
    content_type: "text",
    content_value: "Terms & Conditions"
  },
  {
    section_key: "page_subtitle",
    section_label: "Page Subtitle",
    content_type: "text",
    content_value: "German Exiles Rugby League Lottery – Legal Terms & Conditions"
  },
  {
    section_key: "section_1_title",
    section_label: "Section 1 Title",
    content_type: "text",
    content_value: "1. Lottery Structure"
  },
  {
    section_key: "section_1_content",
    section_label: "Section 1 Content",
    content_type: "richtext",
    content_value: `<ol class="list-decimal list-inside space-y-2">
      <li>The lottery is operated by German Exiles Rugby League (the "Club"), a non-commercial society registered with [Local Council Name] under a Small Society Lottery Registration.</li>
      <li>The promoter of the lottery is [Full Name], [Address], acting on behalf of the Club.</li>
      <li>Each line costs £5 and contains four distinct numbers. Players select four numbers from 1 to 32. No number may be selected more than once per line.</li>
      <li>Players may enter one or more lines per draw. Each line is valid for a single monthly draw.</li>
      <li>The minimum payment accepted is £5 per line. Payment must be completed and verified before the entry is deemed valid.</li>
    </ol>`
  },
  {
    section_key: "section_2_title",
    section_label: "Section 2 Title",
    content_type: "text",
    content_value: "2. Number Selection"
  },
  {
    section_key: "section_2_content",
    section_label: "Section 2 Content",
    content_type: "richtext",
    content_value: `<ol class="list-decimal list-inside" start="6">
      <li>Players may select their own numbers manually via the online portal or use the "Quick Pick" option to receive four computer-generated numbers from 1 to 32.</li>
    </ol>`
  },
  {
    section_key: "section_3_title",
    section_label: "Section 3 Title",
    content_type: "text",
    content_value: "3. Draws"
  },
  {
    section_key: "section_3_content",
    section_label: "Section 3 Content",
    content_type: "richtext",
    content_value: `<ol class="list-decimal list-inside space-y-2" start="7">
      <li>Draws take place at a predetermined location during the last week of each month, generally around 8:00 pm. The exact date of each draw will be published on the German Exiles Rugby League website, displayed at the checkout when purchasing, and confirmed on the entry receipt.</li>
      <li>Draws will be streamed live on the German Exiles Rugby League Facebook page (subject to availability).</li>
      <li>Draws will be recorded and published on German Exiles Rugby League social media.</li>
      <li>In the unlikely event that a live draw cannot take place, a computer will randomly generate winning numbers.</li>
      <li>All draws are conducted fairly, and winning numbers are selected impartially.</li>
    </ol>`
  },
  {
    section_key: "section_4_title",
    section_label: "Section 4 Title",
    content_type: "text",
    content_value: "4. Winners"
  },
  {
    section_key: "section_4_content",
    section_label: "Section 4 Content",
    content_type: "richtext",
    content_value: `<ol class="list-decimal list-inside space-y-2" start="12">
      <li>Winners are selected from all valid entries for that month.</li>
      <li>Jackpot prizes are awarded to entries matching all four numbers. If multiple entries match, the jackpot will be shared equally.</li>
      <li>Every player who has purchased at least one valid line for the relevant month's draw will have their name entered once into that month's Lucky Dip, regardless of how many lines they have purchased. The Lucky Dip is drawn randomly from the list of eligible player names. A player may win more than one Lucky Dip prize, as there is no restriction preventing the same name being drawn multiple times. Players without a valid line for that month will not be entered into that month's Lucky Dip draw.</li>
      <li>Winners will be notified by email or text within three days of the draw and will be published on German Exiles Rugby League social media.</li>
      <li>Winners must claim their prizes within 14 days of notification. Any unclaimed prizes after this period will be retained by the Club and applied to its charitable, sporting, and community purposes.</li>
    </ol>`
  },
  {
    section_key: "section_5_title",
    section_label: "Section 5 Title",
    content_type: "text",
    content_value: "5. Eligibility"
  },
  {
    section_key: "section_5_content",
    section_label: "Section 5 Content",
    content_type: "richtext",
    content_value: `<ol class="list-decimal list-inside space-y-2" start="17">
      <li>The lottery is open to persons aged 18 or over who are legally permitted to participate in UK lotteries. The statutory minimum age is 16, but the Club has chosen to restrict entry to 18+ only. Any entry from ineligible persons will be void and not refunded.</li>
      <li>All claims to a prize are subject to an ID check for proof of age. Refusal to comply will result in the claim being void.</li>
    </ol>`
  },
  {
    section_key: "section_6_title",
    section_label: "Section 6 Title",
    content_type: "text",
    content_value: "6. Payments and Checkout"
  },
  {
    section_key: "section_6_content",
    section_label: "Section 6 Content",
    content_type: "richtext",
    content_value: `<ol class="list-decimal list-inside space-y-2" start="19">
      <li>All payments must be made online via the official payment portal. No other forms of payment are accepted.</li>
      <li>The Club may offer an "Auto Renew" option, allowing payment to be automatically deducted from the card provided to ensure participation in future draws.</li>
      <li>All sales are final. No refunds or cancellations are allowed once payment has been accepted. If a scheduled draw is cancelled, all valid entries will be carried forward to the next available draw.</li>
      <li>At checkout, you are required to:
        <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
          <li>Accept these Terms & Conditions,</li>
          <li>Declare that you are aged 18 or over, and</li>
          <li>Acknowledge that if you win a prize (Jackpot or Lucky Dip), you must claim it within 14 days of notification.</li>
        </ul>
      </li>
    </ol>`
  },
  {
    section_key: "section_7_title",
    section_label: "Section 7 Title",
    content_type: "text",
    content_value: "7. Prize Allocation"
  },
  {
    section_key: "section_7_content",
    section_label: "Section 7 Content",
    content_type: "richtext",
    content_value: `<ol class="list-decimal list-inside space-y-2" start="23">
      <li>The maximum value of any single prize will not exceed £25,000, in line with the Gambling Act 2005.</li>
      <li>The proceeds from the lottery will be allocated as follows:
        <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
          <li>At least 20% of proceeds will be applied to the Club's charitable, sporting, and community purposes.</li>
          <li>Up to 80% may be used for prizes and reasonable administrative costs.</li>
        </ul>
      </li>
      <li>All prizes are non-transferable and will be paid via online banking from the German Exiles Rugby League Club account by the Club Treasurer within 2 to 3 working days of prize confirmation.</li>
    </ol>`
  },
  {
    section_key: "section_8_title",
    section_label: "Section 8 Title",
    content_type: "text",
    content_value: "8. General Rules"
  },
  {
    section_key: "section_8_content",
    section_label: "Section 8 Content",
    content_type: "richtext",
    content_value: `<ol class="list-decimal list-inside space-y-2" start="26">
      <li>Entries submitted after the deadline (7:50 pm on the day of the draw) will be carried forward to the following month.</li>
      <li>Players should retain proof of purchase, a copy of these Terms & Conditions, and any transaction records.</li>
      <li>The decision of the Club regarding draws, winners, and prize distribution is final. This does not affect a participant's statutory rights. Complaints may be raised with the Club in the first instance or with [Local Council Name] as the licensing authority.</li>
      <li>These Terms & Conditions may be amended at any time by the Club. Players will be advised of significant changes via the Club's official communication channels.</li>
      <li>A statutory return will be submitted to [Local Council Name] following each draw, detailing the income, expenses, prizes, and amounts applied to the Club's purposes, in line with licensing requirements.</li>
    </ol>`
  }
];

export const seedLotteryTermsContent = async (): Promise<boolean> => {
  try {
    // Check if content already exists for lottery-terms
    const { data: existing, error: checkError } = await supabase
      .from('site_content')
      .select('id')
      .eq('page', 'lottery-terms')
      .limit(1);

    if (checkError) {
      console.error("Error checking existing content:", checkError);
      return false;
    }

    // If content already exists, don't seed again
    if (existing && existing.length > 0) {
      console.log("Lottery terms content already exists");
      return true;
    }

    // Insert all sections
    for (let i = 0; i < defaultSections.length; i++) {
      const section = defaultSections[i];
      const { error } = await supabase
        .from('site_content')
        .insert({
          page: 'lottery-terms',
          section_key: section.section_key,
          section_label: section.section_label,
          content_type: section.content_type,
          content_value: section.content_value,
          published_value: section.content_value,
          is_published: true,
          display_order: i
        });

      if (error) {
        console.error(`Error inserting section ${section.section_key}:`, error);
        return false;
      }
    }

    console.log("Lottery terms content seeded successfully");
    return true;
  } catch (error) {
    console.error("Error seeding lottery terms content:", error);
    return false;
  }
};
