# BioVolt AI MFC Calculator — Scientific Specification

Status: Phase 1 specification, version 0.1  
Scope: public calculator beta for a single microbial fuel cell  
Primary audiences: MFC researchers, students and laboratory teams

## 1. Product contract

The calculator will separate three kinds of output:

1. **Calculated** — obtained from user measurements and physical equations.
2. **Literature reference** — a reported value from one comparable published condition.
3. **Literature estimate** — a range supported by at least two independent papers.

The first public version will not describe literature matching as machine learning. A trained prediction will be added only after the evidence gate is satisfied.

The calculator must never:

- substitute open-circuit voltage for loaded voltage;
- invent an electrode area, conductivity or material property;
- combine unlike power-density normalization bases;
- present a single-paper result as a confidence interval;
- treat several conditions from the same paper as independent validation studies;
- provide a confident estimate outside the evidence domain.

## 2. Version 1 modes

### 2.1 Calculate from measurements

This is the fast path. The minimum electrical calculation requires loaded voltage and external resistance, or loaded voltage and measured current. Electrode area is required only for normalized current or power density. COD before and after treatment are required for COD removal.

### 2.2 Compare with literature

This mode describes the reactor, biology, substrate, electrodes and operating conditions, then finds comparable audited conditions. It returns cited reference values or an evidence-supported range. It does not overwrite calculated results.

### 2.3 Excluded from Version 1

- MFC stacks and series/parallel stack calculations
- time-series upload and polarization-curve fitting
- internal-resistance estimation
- coulombic-efficiency calculation without current integration
- unrestricted optimization
- trained AI predictions
- persistent storage, login or experiment history

## 3. Premium usability contract

The calculator must feel like a premium scientific instrument rather than a long database form.

### 3.1 Interaction design

- Start with two clear choices: **Calculate from measurements** and **Compare with literature**.
- Use a five-step flow: System, Biology & substrate, Electrodes, Operation, Results.
- Keep the fast path to five visible fields: loaded voltage, resistance, anode area, COD before and COD after.
- Place optional research fields inside an **Advanced conditions** disclosure.
- Show the unit inside each field and permit safe unit switching.
- Keep a live result summary visible on desktop and use a bottom result drawer on mobile.
- Preserve entered values when the user moves between steps.
- Explain salinity versus conductivity and loaded voltage versus open-circuit voltage beside the relevant fields.
- Allow `Unknown / not reported` without silently converting it to zero.
- Include three source-labelled presets only after their fields pass the audit rules.

### 3.2 Visual design

- Continue BioVolt AI's research-journal language: warm paper background, dark ink, electric blue and restrained rules.
- Use large editorial headings, compact monospaced labels and highly legible numeric results.
- Use one dominant result per card, with the unit attached to the number.
- Distinguish Calculated, Literature reference and Literature estimate using both text and visual markers.
- Use motion only for step transitions and result changes; respect reduced-motion settings.
- Avoid decorative charts when a number, interval or comparison table communicates the result more clearly.

### 3.3 Accessibility

- Every control requires a visible label, unit and help description.
- Keyboard navigation and a logical focus order are mandatory.
- Errors appear beside the field and in a page-level summary.
- Colour is never the only indication of evidence quality or error state.
- Touch targets must be at least 44 by 44 CSS pixels.

## 4. Input data dictionary

The machine-readable companion is `calculator-input-schema.json`.

### 4.1 System

| Field | Requirement | Canonical unit / values | Rule |
|---|---|---|---|
| Calculator mode | Required | measured, literature | Selects the fast or evidence path. |
| Cell scope | Required | single_cell | Stacks are rejected in Version 1. |
| Reactor architecture | Required for literature | single chamber, double chamber, other | Unknown architectures lower evidence confidence. |
| Operation mode | Required for literature | batch, continuous, fed-batch | Must match the published condition when known. |
| Working volume | Recommended | mL | Must be greater than zero. |
| Membrane / bridge | Recommended | controlled vocabulary + other | Salt bridge and ion-exchange membranes remain distinct. |
| Electrode spacing | Optional | cm | Must be greater than zero when supplied. |
| Cathode electron acceptor | Recommended | air/oxygen, ferricyanide, permanganate, other | Catholyte chemistry is not inferred from cathode material. |

### 4.2 Biology and substrate

| Field | Requirement | Canonical unit / values | Rule |
|---|---|---|---|
| Organism | Required for literature | scientific name or community label | Species, strain and mixed consortium are stored separately. |
| Culture type | Required for literature | pure, mixed, environmental, unknown | Unknown is valid but lowers completeness. |
| Inoculum source | Recommended | text + taxonomy | Never inferred from the organism name. |
| Biofilm/acclimation age | Optional | days | Must be non-negative. |
| Mediator | Optional | none, endogenous, exogenous, unknown | Unknown is not equivalent to none. |
| Substrate | Required for literature | normalized category + original label | Glucose, acetate, wastewater and complex waste remain distinct. |
| Substrate concentration | Recommended | g/L | Original units are preserved before conversion. |
| Initial COD | Recommended for treatment | mg/L | Must be greater than zero for COD removal and loading calculations. |
| Final COD | Required for measured COD removal | mg/L | May exceed initial COD; the result then becomes negative and receives a warning. |

### 4.3 Electrodes

| Field | Requirement | Canonical unit / values | Rule |
|---|---|---|---|
| Anode material | Required for literature | taxonomy + original label | Graphite rod, carbon cloth, carbon felt and mesh are distinct. |
| Cathode material | Required for literature | taxonomy + original label | Catalyst and catholyte are stored separately. |
| Anode exposed area | Required for anode-normalized density | cm², stored as m² | Must be greater than zero. |
| Cathode exposed area | Required for cathode-normalized density | cm², stored as m² | Must be greater than zero. |
| Area basis | Required for density | anode geometric, cathode geometric, projected, specific | Unknown basis prevents direct literature pooling. |
| Surface treatment | Optional | text + taxonomy | Treated and untreated materials remain distinct. |
| Catalyst / coating | Optional | text + taxonomy | Platinum, biochar and no catalyst are not merged. |
| Measured conductivity | Optional | S/m | Used only when the exact tested electrode was measured or reported. |

### 4.4 Operating conditions

| Field | Requirement | Canonical unit / values | Rule |
|---|---|---|---|
| Temperature | Recommended | °C | Accepted technical range is 0–80 °C; evidence-domain limits are calculated from eligible papers. |
| pH | Recommended | pH | Hard range 0–14. |
| Salinity | Recommended for saline systems | g/L | Non-negative; not derived from conductivity. |
| Conductivity | Recommended for saline systems | mS/cm | Non-negative; not treated as salinity. |
| External load mode | Required | resistor, open circuit, short circuit | Only resistor mode supports `I = V/R`. |
| External resistance | Required for Ohm's-law path | Ω | Must be greater than zero in resistor mode. |
| Hydraulic retention time | Recommended for continuous systems | h | Must be greater than zero. |
| Flow rate | Optional | L/day | Must be greater than zero. |
| Experiment duration | Recommended | h | Required for energy and batch-rate calculations. |

### 4.5 Electrical measurements

| Field | Requirement | Canonical unit / values | Rule |
|---|---|---|---|
| Loaded voltage | Required for voltage-based calculation | V | Recorded under a stated external load. |
| Measured current | Optional | mA | Compared with `V/R` when all three values are present. |
| Open-circuit voltage | Optional | V | Displayed separately and never used as loaded voltage. |
| Reported power density | Optional reconciliation field | mW/m² | Requires its normalization basis. |
| Reported current density | Optional reconciliation field | mA/m² | Requires its normalization basis. |
| Replicate count | Recommended | integer | Must be at least one. |
| Reported uncertainty | Optional | same unit as metric | The statistic type must be stated when known. |

## 5. Canonical conversions

- `area_m2 = area_cm2 × 0.0001`
- `current_A = current_mA ÷ 1000`
- `power_W = power_mW ÷ 1000`
- `volume_L = volume_mL ÷ 1000`
- `substrate_g_L = substrate_mg_L ÷ 1000`
- `conductivity_S_m = conductivity_mS_cm × 0.1`
- `duration_h = duration_minutes ÷ 60`

Every converted value must retain its original value, original unit and conversion rule in memory while the calculation is active.

## 6. Formula engine

### 6.1 Electrical calculations

When loaded voltage `V` and external resistance `R` are supplied:

- `I_A = V / R`
- `P_W = V² / R`

When loaded voltage `V` and measured current `I` are supplied:

- `P_W = V × I`

When current `I` and resistance `R` are supplied:

- `P_W = I² × R`

When exposed normalization area `A` is known:

- `current_density_mA_m2 = (I_A / A_m2) × 1000`
- `power_density_mW_m2 = (P_W / A_m2) × 1000`

When duration is known:

- `energy_Wh = P_W × duration_h`

The interface must name the selected area basis beside every density result.

### 6.2 Treatment calculations

- `cod_removal_percent = ((COD_in - COD_out) / COD_in) × 100`
- `hrt_days = hrt_hours / 24`
- `organic_loading_rate_kg_m3_d = COD_in_g_L / hrt_days`

The HRT form of organic loading rate is allowed only for a continuous system with a meaningful steady-flow HRT. When flow and volume are supplied, the calculator may cross-check `HRT = V/Q`.

### 6.3 Consistency checks

If voltage, resistance and measured current are all present:

- calculate `I_expected = V/R`;
- warn when measured and expected current differ by more than 5%;
- mark the record as severe inconsistency when the difference exceeds 25%.

If reported and recalculated density are present:

- warn when they differ by more than 10%;
- mark the record as severe inconsistency when they differ by more than 25%;
- retain both values and do not silently replace the reported result.

## 7. Result precedence and language

1. A valid equation result takes precedence when all required measured inputs are present.
2. A literature result supplements the calculated result; it never replaces it.
3. One independent paper produces a **Literature reference**, not an estimate.
4. Two or more independent papers may produce a **Literature estimate**, subject to match quality.
5. A future trained model must be labelled **Model prediction** and show its validation version.

Required result metadata:

- value and unit;
- calculation or evidence method;
- area basis when normalized;
- input completeness;
- evidence tier;
- citations and condition IDs;
- warnings and refusal reason;
- timestamp and specification version.

## 8. Evidence eligibility

A condition may enter numerical matching only when all of the following are true:

- it is a primary or supporting experiment, not a review maximum;
- its intended use is `Calculator benchmark` or an approved target-specific benchmark;
- the requested output was reported in a comparable unit;
- voltage type and external load are known when voltage is compared;
- density normalization basis is known when density is compared;
- its quality flag does not say `Do not pool`;
- its paper and condition identifiers are present.

Private reviewed sources may contribute derived measurements and citations, but the source PDF must not be distributed or linked as a hosted copy.

## 9. Similarity engine

Similarity is calculated separately for power-density and COD-removal targets.

### 9.1 Initial power-density weights

| Feature | Weight |
|---|---:|
| Reactor architecture | 10 |
| Microbe / community | 12 |
| Substrate | 12 |
| Anode material | 10 |
| Cathode material | 8 |
| External resistance | 14 |
| Substrate concentration | 6 |
| Salinity / conductivity context | 10 |
| Temperature | 5 |
| pH | 5 |
| Membrane / catholyte | 5 |
| Working volume | 3 |

### 9.2 Initial COD-removal weights

| Feature | Weight |
|---|---:|
| Reactor architecture | 8 |
| Microbe / community | 12 |
| Substrate | 14 |
| Anode material | 5 |
| Cathode material | 3 |
| External resistance / circuit mode | 5 |
| Substrate concentration | 8 |
| Salinity / conductivity context | 8 |
| Temperature | 6 |
| pH | 6 |
| HRT / treatment duration | 15 |
| Initial COD / organic loading | 10 |

Categorical values use controlled hierarchical matches. Numeric values use a robust, data-derived scale. Missing values are removed from the comparison denominator, then a completeness penalty is applied. Less than 50% comparable feature weight produces an outside-domain result.

## 10. Evidence tiers and intervals

| Tier | Minimum rule | Output behavior |
|---|---|---|
| High | score ≥ 0.80, at least 3 independent papers and 5 eligible conditions | Show supported range and central estimate. |
| Moderate | score ≥ 0.65, at least 2 independent papers and 3 eligible conditions | Show range with prominent limitations. |
| Low | score ≥ 0.45 but insufficient independent evidence | Show individual references; no confidence interval. |
| Outside domain | score < 0.45, critical mismatch or <50% comparable weight | Refuse a numerical estimate. |

For two to four independent papers, display the weighted median and observed minimum–maximum range. With at least five papers, display the weighted median and interquartile range. A paper-grouped bootstrap interval may be introduced only after at least ten independent papers support the target domain.

## 11. Warning and refusal catalogue

### Refuse the requested calculation

- unsupported MFC stack;
- zero or negative resistance in resistor mode;
- missing loaded voltage and current for electrical power;
- missing or non-positive area for a requested density;
- unknown area-normalization basis for literature density comparison;
- non-positive initial COD for COD-removal calculation;
- fewer than two independent studies when an estimate rather than a reference is requested;
- evidence completeness below 50%;
- unrecognized unit with no safe conversion.

### Calculate but warn

- COD after treatment exceeds COD before treatment;
- measured current conflicts with `V/R`;
- reported density conflicts with recalculation;
- input falls outside the eligible literature range;
- only one paper supports the closest reference;
- conductivity or salinity is missing for a halophilic comparison;
- electrode material is known but its exact surface treatment is not;
- result is based on a private reviewed source with no public full-text link.

## 12. Acceptance criteria for Phase 2 implementation

- All formula outputs reproduce the approved validation cases within stated tolerances.
- Open-circuit and loaded voltage are separate in state, UI and exports.
- Density cannot be calculated without a positive area and selected basis.
- Unknown values remain null rather than becoming zero.
- A single paper never produces a confidence interval.
- Every literature value displays its condition ID and citation.
- The calculator works entirely in the public GitHub Pages build without sending form data.
- The primary path is usable on a 360-pixel-wide screen and with a keyboard.
- The result panel clearly distinguishes calculated, referenced and estimated values.

## 13. Phase 1 decision gate

Phase 2 may begin after approval of:

1. the field list and canonical units;
2. the formula and reconciliation thresholds;
3. the evidence weights and confidence tiers;
4. the three validation cases;
5. the premium five-step interaction model.

