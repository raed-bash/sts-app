import { useState } from "react";
// import SelectApi from "./components/inputs/SelectApi";
import type { RawSelectMap } from "./components/inputs/select/hooks/useRawSelectUtils";
import type { QueryResponseType } from "./hooks/useSelectApi";
import AutocompleteApi, {
  type AutocompleteApiFnParams,
} from "./components/inputs/AutocompleteApi";
import SelectApi from "./components/inputs/SelectApi";

function App() {
  const [value, setValue] = useState<RawSelectMap<VisaType> | undefined>(
    new Map([
      [
        252,
        {
          id: 252,
          name: "تسليم اقامة",
          recordType: "ENTRANCE",
        },
      ],
      [
        253,
        {
          id: 253,
          name: "تسليم فورمة",
          recordType: "ENTRANCE",
        },
      ],
      [
        258,
        {
          id: 258,
          name: "تاجر ",
          recordType: "ENTRANCE",
        },
      ],
      [
        1,
        {
          id: 1,
          name: "زيارة",
          recordType: "ENTRANCE",
        },
      ],
      [
        2,
        {
          id: 2,
          name: "مريض",
          recordType: "EXIT",
        },
      ],
      [
        3,
        {
          id: 3,
          name: "عروسة ",
          recordType: "EXIT",
        },
      ],
      [
        4,
        {
          id: 4,
          name: "تاجر",
          recordType: "EXIT",
        },
      ],
      [
        5,
        {
          id: 5,
          name: "عودة اجانب",
          recordType: "EXIT",
        },
      ],
      [
        6,
        {
          id: 6,
          name: "عودة/ اقامة عراقية",
          recordType: "EXIT",
        },
      ],
      [
        7,
        {
          id: 7,
          name: "زيارة",
          recordType: "EXIT",
        },
      ],
      [
        8,
        {
          id: 8,
          name: "عروسة",
          recordType: "ENTRANCE",
        },
      ],
      [
        9,
        {
          id: 9,
          name: "ضيوف",
          recordType: "ENTRANCE",
        },
      ],
      [
        10,
        {
          id: 10,
          name: "صحافة",
          recordType: "EXIT",
        },
      ],
      [
        11,
        {
          id: 11,
          name: "صحافة",
          recordType: "ENTRANCE",
        },
      ],
      [
        12,
        {
          id: 12,
          name: "منظمة",
          recordType: "ENTRANCE",
        },
      ],
      [
        13,
        {
          id: 13,
          name: "حالة اسعافية",
          recordType: "EXIT",
        },
      ],
      [
        14,
        {
          id: 14,
          name: "منظمة ",
          recordType: "EXIT",
        },
      ],
      [
        15,
        {
          id: 15,
          name: "مرافق اسعاف",
          recordType: "EXIT",
        },
      ],
      [
        16,
        {
          id: 16,
          name: "مرافق مريض",
          recordType: "EXIT",
        },
      ],
      [
        17,
        {
          id: 17,
          name: "مريض",
          recordType: "ENTRANCE",
        },
      ],
      [
        244,
        {
          id: 244,
          name: "الجنازة ",
          recordType: "ENTRANCE",
        },
      ],
      [
        245,
        {
          id: 245,
          name: " زيارة",
          recordType: "ENTRANCE",
        },
      ],
      [
        246,
        {
          id: 246,
          name: "عودة/اقامة عراقية",
          recordType: "ENTRANCE",
        },
      ],
      [
        247,
        {
          id: 247,
          name: "حالة اسعافية",
          recordType: "ENTRANCE",
        },
      ],
      [
        248,
        {
          id: 248,
          name: "مرافق مريض",
          recordType: "ENTRANCE",
        },
      ],
      [
        271,
        {
          id: 271,
          name: "عروسة1",
          recordType: "EXIT",
          attributes: [
            {
              id: 1,
              key: "ةليليب",
              type: "BOOLEAN",
              required: false,
            },
          ],
        },
      ],
      [
        251,
        {
          id: 251,
          name: "عودة  اجانب",
          recordType: "ENTRANCE",
        },
      ],
      [
        249,
        {
          id: 249,
          name: "وفد جنازة",
          recordType: "ENTRANCE",
        },
      ],
    ])
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(value);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 m-10">
      <AutocompleteApi<VisaType>
        queryKey={["users"]}
        queryFn={({ pageParam = 1, search }) =>
          fetchData({ search, pageParam })
        }
        multiple
        getUniqueValue={(o) => o.id}
        getInputLabel={(o) => [...o.values()].map((opt) => opt.name).join(", ")}
        getOptionLabel={(o) => o.id + " " + o.name}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        value={value}
        enableTooltip
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default App;
interface VisaType {
  id: number;

  name: string;
}

const token =
  "eyJhbGciOiJSUzI1NiJ9.eyJVc2VySWQiOjU1NCwiUm9sZXMiOlt7ImF1dGhvcml0eSI6IlNVUEVSX0FETUlOIn0seyJhdXRob3JpdHkiOiJNQU5BR0VNRU5UX09GRklDRSJ9LHsiYXV0aG9yaXR5IjoiRU5UUllfT0ZGSUNFIn0seyJhdXRob3JpdHkiOiJFWElUX09GRklDRSJ9LHsiYXV0aG9yaXR5IjoiT1JHQU5JWkFUSU9OX09GRklDRSJ9XSwic3ViIjoieWFyYSIsImlhdCI6MTc2Mzc1MDg5MiwiZXhwIjoxNzYzODM3MjkyfQ.R1nCGW2A_8GFpIWx1HSxOeYRaVHIw4rIo1yG20YO7kKw4l6SsMZFkXn4iYhahwJvcuKfmHWhBwLPVrMv4zaarPzXzYpmUIrttipn6vY2nAA-aPoPFfcWCOuMjfQzt6O_rRV8zyvnSdykC3pjjKSuRgu5ETWYzbMy0xWon3xkBQ5QJQ1-5YjjE9NXJL3pAEQ9y_sGiwjq6geo6h7MIFl9rKejgOSDU3ERj48uGjfsn9TADgUwar4BbDGBnvm1KGg6QQYsSCDE3EBmpG-hNM0_U_3QKF_Qjrl8ugEk9pdVuX5s02R6gUdDVKGzqUbCyKr_1QFCa8ilEG27H1QrwHfBAQ";

async function fetchData({
  pageParam,
  search,
}: AutocompleteApiFnParams): Promise<QueryResponseType<VisaType>> {
  try {
    const res = await fetch(
      `http://localhost:3002/visa-type?page=${pageParam}&name=${search}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const json = (await res.json()) as {
      data: VisaType[];
      meta: {
        total: number;
      };
    };

    return { pageParam, data: json.data, count: json.meta.total };
  } catch {
    return { pageParam, data: [], count: 0 };
  }
}
