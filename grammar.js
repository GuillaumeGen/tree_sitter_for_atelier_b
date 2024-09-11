
module.exports = grammar({
  name: 'B_language',

  rules: {

    source_file: $ => $.component,

    ident: _ => /[a-zA-Z_]+/,

    integer_literal: _ => /[0-9]+/,

    string_lit: _ => /\"[^"]*\"/,

    // Initial axiom
    component: $ => choice(
      $.machine,
      $.refinement,
      $.implementation
    ),

    // Clauses
    machine: $ => seq(
      "MACHINE",
      $.header,
      repeat($.clause_machine_abstract),
      "END"
    ),

    header: $ => seq(
      $.ident,
      optional(seq(
        "(",
        separated_seq(
          ",",
          $.ident
        ),
        ")"
      ))
    ),

    clause_machine_abstract: $ => choice(
      $.clause_constraints,
      $.clause_sees,
      $.clause_includes,
      $.clause_promotes,
      $.clause_extends,
      $.clause_uses,
      $.clause_sets,
      $.clause_concrete_constants,
      $.clause_abstract_constants,
      $.clause_properties,
      $.clause_concrete_variables,
      $.clause_abstract_variables,
      $.clause_invariant,
      $.clause_assertions,
      $.clause_initialization,
      $.clause_operations,
      $.clause_definitions
    ),

    clause_constraints: $ => seq(
      "CONSTRAINTS",
      $.predicate
    ),

    predicate: $ => choice(
      seq(
        "(",
        $.predicate,
        ")"
      ),
      seq(
        "not",
        "(",
        $.predicate,
        ")"
      ),
      prec.left(40,seq(
        $.predicate,
        "&",
        $.predicate
      )),
      prec.left(40,seq(
        $.predicate,
        "or",
        $.predicate
      )),
      prec.left(30,seq(
        $.predicate,
        "=>",
        $.predicate
      )),
      prec.left(60,seq(
        $.predicate,
        "<=>",
        $.predicate
      )),
      prec(250,seq(
        "!",
        $.list_ident,
        ".",
        "(",
        $.predicate,
        "=>",
        $.predicate,
        ")"
      )),
      prec(250,seq(
        "#",
        $.list_ident,
        ".",
        "(",
        $.predicate,
        ")"
      )),
      prec.left(60, seq(
        $.expression,
        "=",
        $.expression
      )),
      prec.left(160, seq(
        $.expression,
        "/=",
        $.expression
      )),
      prec.left(60, seq(
        $.expression,
        ":",
        $.expression
      )),
      prec.left(160, seq(
        $.expression,
        "/:",
        $.expression
      )),
      prec.left(110, seq(
        $.expression,
        "<:",
        $.expression
      )),
      prec.left(110, seq(
        $.expression,
        "<<:",
        $.expression
      )),
      prec.left(110, seq(
        $.expression,
        "/<:",
        $.expression
      )),
      prec.left(110, seq(
        $.expression,
        "/<<:",
        $.expression
      )),
      prec.left(160, seq(
        $.expression,
        "<=",
        $.expression
      )),
      prec.left(160, seq(
        $.expression,
        "<",
        $.expression
      )),
      prec.left(160, seq(
        $.expression,
        ">=",
        $.expression
      )),
      prec.left(160, seq(
        $.expression,
        ">",
        $.expression
      )),
    ),

    // Expressions
    expression: $ => choice(
      $.expression_primary,
      $.expression_boolean,
      $.arithmetical_expression,
      $.expression_of_couples,
      $.expression_of_sets,
      $.construction_of_sets,
      $.expression_of_relations,
      $.expression_of_functions,
      $.construction_of_functions,
      $.expression_of_sequences,
      $.construction_of_sequences
    ),

    expression_primary: $ => choice(
      $.data,
      $.expr_bracketed
    ),

    data: $ => seq(
      separated_seq(
        ".",
        $.ident
      ),
      optional(
        "$0"
      )
    ),

    expr_bracketed: $ => seq(
      "(",
      $.expression,
      ")"
    ),

    expression_boolean: $ => choice(
      $.boolean_lit,
      $.conversion_bool
    ),

    boolean_lit: $ => choice(
      "TRUE",
      "FALSE"
    ),

    conversion_bool: $ => seq(
      "bool",
      "(",
      $.predicate,
      ")"
    ),

    arithmetical_expression: $ => choice(
      $.integer_lit,
      prec.left(180,seq(
        $.arithmetical_expression,
        "+",
        $.arithmetical_expression
      )),
      prec.left(180,seq(
        $.arithmetical_expression,
        "-",
        $.arithmetical_expression
      )),
      prec.left(190,seq(
        $.arithmetical_expression,
        "*",
        $.arithmetical_expression
      )),
      prec.left(190,seq(
        $.arithmetical_expression,
        "/",
        $.arithmetical_expression
      )),
      prec.left(190,seq(
        $.arithmetical_expression,
        "mod",
        $.arithmetical_expression
      )),
      prec.right(200,seq(
        $.arithmetical_expression,
        "**",
        $.arithmetical_expression
      )),
      prec(210,seq(
        "-",
        $.arithmetical_expression
      )),
      seq(
        choice(
          "succ",
          "pred",
          "floor",
          "ceiling",
          "real"
        ),
        "(",
        $.arithmetical_expression,
        ")"
      ),
      seq(
        choice(
          "SIGMA",
          "PI"
        ),
        $.list_ident,
        ".",
        "(",
        $.predicate,
        "|",
        $.expression,
        ")"
      )
    ),

    integer_lit: $ => choice(
      $.integer_literal,
      "MAXINT",
      "MININT"
    ),

    expression_of_couples: $ => prec.left(160,seq(
      $.expression,
      choice(
        "|->",
        ","
      ),
      $.expression
    )),

    expression_of_sets: $ => choice(
      seq(
        "{",
        "}"
      ),
      $.number_set,
      "BOOL",
      "STRING"
    ),

    number_set: $ => choice(
      "INTEGER",
      "NATURAL",
      "NATURAL1",
      "NAT",
      "NAT1",
      "INT"
    ),

    construction_of_sets: $ => choice(
      $.product,
      $.comprehension_set,
      $.subsets,
      $.finite_subsets,
      $.interval,
      $.difference,
      $.union,
      $.intersection,
      $.generalized_union,
      $.generalized_intersection,
      $.quantified_union,
      $.quantified_intersection
    ),

    product: $ => prec.left(190,seq(
      $.expression,
      "*",
      $.expression
    )),

    comprehension_set: $ => seq(
      "{",
      separated_seq(
        ",",
        $.ident
      ),
      optional(seq(
        "|",
        $.predicate
      )),
      "}"
    ),

    subsets: $ => seq(
      choice(
        "POW",
        "POW1"
      ),
      "(",
      $.expression,
      ")"
    ),

    finite_subsets: $ => seq(
      choice(
        "FIN",
        "FIN1"
      ),
      "(",
      $.expression,
      ")"
    ),

    expression_of_number: $ => choice(
      $.expression_primary,
      $.arithmetical_expression,
    ),

    interval: $ => prec.left(170,seq(
      $.expression_of_number,
      "..",
      $.expression_of_number
    )),

    difference: $ => prec.left(180,seq(
      $.expression,
      "-",
      $.expression
    )),

    union: $ => prec.left(160,seq(
      $.expression,
      "\\/",
      $.expression
    )),

    intersection: $ => prec.left(160,seq(
      $.expression,
      "/\\",
      $.expression
    )),

    generalized_union: $ => seq(
      "union",
      "(",
      $.expression,
      ")"
    ),

    generalized_intersection: $ => seq(
      "inter",
      "(",
      $.expression,
      ")"
    ),

    quantified_union: $ => seq(
      "UNION",
      $.list_ident,
      ".",
      "(",
      $.predicate,
      "|",
      $.expression,
      ")"
    ),

    quantified_intersection: $ => seq(
      "INTER",
      $.list_ident,
      ".",
      "(",
      $.predicate,
      "|",
      $.expression,
      ")"
    ),

    expression_of_relations: $ => choice(
      $.relations,
      $.identity,
      $.reverse,
      $.first_projection,
      $.second_projection,
      $.composition,
      $.direct_product,
      $.parallel_product,
      $.iteration,
      $.reflexive_closure,
      $.closure,
      $.domain,
      $.range,
      $.image,
      $.domain_restriction,
      $.domain_substraction,
      $.range_restriction,
      $.range_substraction,
      $.overwrite
    ),

    relations: $ => prec.left(125,seq(
      $.expression,
      "<->",
      $.expression
    )),

    identity: $ => seq(
      "id",
      "(",
      $.expression,
      ")"
    ),

    reverse: $ => seq(
      $.expression,
      "~"
    ),

    first_projection: $ => seq(
      "prj1",
      "(",
      $.expression,
      ")"
    ),

    second_projection: $ => seq(
      "prj2",
      "(",
      $.expression,
      ")"
    ),

    composition: $ => prec.left(20,seq(
      $.expression,
      ";",
      $.expression
    )),

    direct_product: $ => prec.left(160,seq(
      $.expression,
      "><",
      $.expression
    )),

    parallel_product: $ => prec.left(20,seq(
      $.expression,
      "||",
      $.expression
    )),

    iteration: $ => seq(
      "iterate",
      "(",
      $.expression,
      ",",
      $.expression,
      ")"
    ),

    reflexive_closure: $ => seq(
      "closure",
      "(",
      $.expression,
      ")"
    ),

    closure: $ => seq(
      "closure1",
      "(",
      $.expression,
      ")"
    ),

    domain: $ => seq(
      "dom",
      "(",
      $.expression,
      ")"
    ),

    range: $ => seq(
      "ran",
      "(",
      $.expression,
      ")"
    ),

    image: $ => seq(
      $.expression,
      "[",
      $.expression,
      "]"
    ),

    domain_restriction: $ => prec.left(160,seq(
      $.expression,
      "<|",
      $.expression
    )),

    domain_substraction: $ => prec.left(160,seq(
      $.expression,
      "<<|",
      $.expression
    )),

    range_restriction: $ => prec.left(160,seq(
      $.expression,
      "|>",
      $.expression
    )),

    range_substraction: $ => prec.left(160,seq(
      $.expression,
      "|>>",
      $.expression
    )),

    overwrite: $ => prec.left(160,seq(
      $.expression,
      "<+",
      $.expression
    )),

    expression_of_functions: $ => choice(
      $.partial_function,
      $.total_function,
      $.partial_injection,
      $.total_injection,
      $.partial_surjection,
      $.total_surjection,
      $.total_bijection
    ),

    partial_function: $ => prec.left(125,seq(
      $.expression,
      "+->",
      $.expression
    )),

    total_function: $ => prec.left(125,seq(
      $.expression,
      "-->",
      $.expression
    )),

    partial_injection: $ => prec.left(125,seq(
      $.expression,
      ">+>",
      $.expression
    )),

    total_injection: $ => prec.left(125,seq(
      $.expression,
      ">->",
      $.expression
    )),

    partial_surjection: $ => prec.left(125,seq(
      $.expression,
      "+->>",
      $.expression
    )),

    total_surjection: $ => prec.left(125,seq(
      $.expression,
      "-->>",
      $.expression
    )),

    total_bijection: $ => prec.left(125,seq(
      $.expression,
      ">->>",
      $.expression
    )),

    construction_of_functions: $ => choice(
      $.lambda_expression,
      $.evaluation_function,
      $.transformed_function,
      $.transformed_relation
    ),

    lambda_expression: $ => prec(250,seq(
      "%",
      $.list_ident,
      ".",
      "(",
      $.predicate,
      "|",
      $.expression,
      ")"
    )),

    evaluation_function: $ => seq(
      choice(
        $.ident,
        $.expr_bracketed
      ),
      "(",
      $.expression,
      ")"
    ),

    transformed_function: $ => seq(
      "fnc",
      "(",
      $.expression,
      ")"
    ),

    transformed_relation: $ => seq(
      "rel",
      "(",
      $.expression,
      ")"
    ),

    expression_of_sequences: $ => choice(
      $.sequences,
      $.non_empty_sequences,
      $.injective_sequences,
      $.non_empty_inj_sequences,
      $.permutations
    ),

    sequences: $ => seq(
      "seq",
      "(",
      $.expression,
      ")"
    ),

    non_empty_sequences: $ => seq(
      "seq1",
      "(",
      $.expression,
      ")"
    ),

    injective_sequences: $ => seq(
      "iseq",
      "(",
      $.expression,
      ")"
    ),

    non_empty_inj_sequences: $ => seq(
      "iseq1",
      "(",
      $.expression,
      ")"
    ),

    permutations: $ => seq(
      "perm",
      "(",
      $.expression,
      ")"
    ),

    construction_of_sequences: $ => choice(
      $.empty_sequences,
      $.sequence_extension,
      $.sequence_size,
      $.sequence_first_element,
      $.sequence_last_element,
      $.head_sequence,
      $.queue_sequence,
      $.reverse_sequence,
      $.concatenation,
      $.insert_start,
      $.insert_tail,
      $.restrict_head,
      $.restrict_tail,
      $.generalized_concat
    ),

    empty_sequences: $ => seq(
      "[",
      "]"
    ),

    sequence_extension: $ => seq(
      "[",
      separated_seq(
        ",",
        $.expression
      ),
      "]"
    ),

    sequence_size: $ => seq(
      "size",
      "(",
      $.expression,
      ")"
    ),

    sequence_first_element: $ => seq(
      "first",
      "(",
      $.expression,
      ")"
    ),

    sequence_last_element: $ => seq(
      "last",
      "(",
      $.expression,
      ")"
    ),

    head_sequence: $ => seq(
      "front",
      "(",
      $.expression,
      ")"
    ),

    queue_sequence: $ => seq(
      "tail",
      "(",
      $.expression,
      ")"
    ),

    reverse_sequence: $ => seq(
      "rev",
      "(",
      $.expression,
      ")"
    ),

    concatenation: $ => prec.left(160,seq(
      $.expression,
      "^",
      $.expression
    )),

    insert_start: $ => prec.left(130,seq(
      $.expression,
      "->",
      $.expression
    )),

    insert_tail: $ => prec.left(160,seq(
      $.expression,
      "<-",
      $.expression
    )),

    restrict_head: $ => prec.left(160,seq(
      $.expression,
      "/|\\",
      $.expression
    )),

    restrict_tail: $ => prec.left(160,seq(
      $.expression,
      "\\|/",
      $.expression
    )),

    generalized_concat: $ => seq(
      "conc",
      "(",
      $.expression,
      ")"
    ),

    clause_sees: $ => seq(
      "SEES",
      separated_seq(
        ",",
        separated_seq(
          ".",
          $.ident
        )
      )
    ),

    clause_includes: $ => seq(
      "INCLUDES",
      separated_seq(
        ",",
        seq(
          separated_seq(
            ".",
            $.ident
          ),
          optional(seq(
            "(",
            separated_seq(
              ",",
              $.instanciation
            ),
            ")"
          ))
        )
      )
    ),

    instanciation: $ => choice(
      $.term,
      $.number_set,
      prec.left(10, "BOOL"),
      $.interval
    ),

    refinement: $ => seq(
      "REFINEMENT",
      $.header,
      $.clause_refines,
      repeat($.clause_refinement),
      "END"
    ),

    clause_refines: $ => seq(
      "REFINES",
      $.ident
    ),

    clause_refinement: $ => choice(
      $.clause_sees,
      $.clause_includes,
      $.clause_promotes,
      $.clause_extends,
      $.clause_sets,
      $.clause_concrete_constants,
      $.clause_abstract_constants,
      $.clause_properties,
      $.clause_concrete_variables,
      $.clause_abstract_variables,
      $.clause_invariant,
      $.clause_assertions,
      $.clause_initialization,
      $.clause_operations
    ),

    implementation: $ => seq(
      "IMPLEMENTATION",
      $.header,
      $.clause_refines,
      repeat($.clause_implementation),
      "END"
    ),

    clause_implementation: $ => choice(
      $.clause_sees,
      $.clause_imports,
      $.clause_promotes,
      $.clause_extends_B0,
      $.clause_sets,
      $.clause_concrete_constants,
      $.clause_properties,
      $.clause_values,
      $.clause_concrete_variables,
      $.clause_invariant,
      $.clause_assertions,
      $.clause_initialization_B0,
      $.clause_operations_B0
    ),

    clause_promotes: $ => seq(
      "PROMOTES",
      separated_seq(
        ",",
        separated_seq(
          ".",
          $.ident
        )
      )
    ),

    clause_extends: $ => seq(
      "EXTENDS",
      separated_seq(
        ",",
        seq(
          optional(seq(
            $.ident,
            "."
          )),
          $.ident,
          optional(seq(
            "(",
            separated_seq(
              ",",
              $.instanciation
            ),
            ")"
          ))
        )
      )
    ),

    clause_uses: $ => seq(
      "USES",
      separated_seq(
        ",",
        seq(
          optional(seq(
            $.ident,
            "."
          )),
          $.ident
        )
      )
    ),

    clause_sets: $ => seq(
      "SETS",
      separated_seq(
        ";",
        $.set
      )
    ),

    clause_concrete_constants: $ => seq(
      choice(
        "CONCRETE_CONSTANTS",
        "CONSTANTS"
      ),
      separated_seq(
        ",",
        $.ident
      )
    ),

    clause_abstract_constants: $ => seq(
      "ABSTRACT_CONSTANTS",
      separated_seq(
        ",",
        $.ident
      )
    ),

    clause_properties: $ => seq(
      "PROPERTIES",
      $.predicate
    ),

    clause_concrete_variables: $ => seq(
      "CONCRETE_VARIABLES",
      separated_seq(
        ",",
        separated_seq(
          ".",
          $.ident
        )
      )
    ),

    clause_abstract_variables: $ => seq(
      choice(
        "ABSTRACT_VARIABLES",
        "VARIABLES"
      ),
      separated_seq(
        ",",
        $.ident
      )
    ),

    clause_invariant: $ => seq(
      "INVARIANT",
      $.predicate
    ),

    clause_assertions: $ => seq(
      "ASSERTIONS",
      separated_seq(
        ";",
        $.predicate
      )
    ),

    clause_initialization: $ => seq(
      "INITIALISATION",
      $.substitution
    ),

    clause_initialization_B0: $ => seq(
      "INITIALISATION",
      $.instruction
    ),

    clause_operations: $ => seq(
      "OPERATIONS",
      separated_seq(
        ";",
        $.operation
      )
    ),

    // Useful syntax rule
    list_ident: $ => choice(
      $.ident,
      seq(
        "(",
        separated_seq(
          ",",
          $.ident
        ),
        ")"
      )
    ),

    clause_imports: $ => seq(
      "IMPORTS",
      separated_seq(
        ",",
        seq(
          optional(seq(
            $.ident,
            "."
          )),
          $.ident,
          optional(seq(
            "(",
            separated_seq(
              ",",
              $.instanciation_B0
            ),
            ")"
          ))
        )
      )
    ),

    instanciation_B0: $ => choice(
      $.term,
      $.number_set_B0,
      "BOOL",
      $.interval
    ),

    clause_extends_B0: $ => seq(
      "EXTENDS",
      separated_seq(
        ",",
        seq(
          optional(seq(
            $.ident,
            "."
          )),
          $.ident,
          optional(seq(
            "(",
            separated_seq(
              ",",
              $.instanciation_B0
            ),
            ")"
          ))
        )
      )
    ),

    clause_values: $ => seq(
      "VALUES",
      separated_seq(
        ";",
        $.valuiing
      )
    ),

    valuiing: $ => seq(
      $.ident,
      "=",
      choice(
        $.term,
        seq(
          "bool",
          "(",
          $.condition,
          ")"
        ),
        $.expr_array,
        $.interval_B0
      )
    ),

    becomes_equal_instruction: $ => choice(
      seq(
        separated_seq(
          ".",
          $.ident
        ),
        optional($.seq_of_terms),
        ":=",
        $.term
      ),
      seq(
        separated_seq(
          ".",
          $.ident
        ),
        ":=",
        $.expr_array
      ),
      seq(
        separated_seq(
          ".",
          $.ident
        ),
        ":=",
        "bool",
        "(",
        $.condition,
        ")"
      )
    ),

    clause_initialization_B0: $ => seq(
      "INITIALISATION",
      $.instruction
    ),

    clause_operations_B0: $ => seq(
      "OPERATIONS",
      separated_seq(
        ";",
        $.operation_B0
      )
    ),

    operation_B0: $ => seq(
      $.header_operation,
      "=",
      $.level1_instruction
    ),

    // Terms and groups of expressions
    term: $ => choice(
      $.simple_term,
      seq(
        separated_seq(
          ".",
          $.ident
        ),
        "(",
        separated_seq(
          ",",
          $.term
        ),
        ")"
      ),
      $.arithmetical_expression
    ),

    simple_term: $ => choice(
      separated_seq(
        ".",
        $.ident
      ),
      $.boolean_lit
    ),

    set: $ => choice(
      $.ident,
      seq(
        $.ident,
        "=",
        "{",
        separated_seq(
          ",",
          $.ident
        ),
        "}"
      )
    ),

    // Substitutions
    substitution: $ => choice(
      $.level1_substitution,
      $.sequence_substitution,
      $.simultaneous_substitution
    ),

    operation: $ => seq(
      $.header_operation,
      "=",
      $.level1_substitution
    ),

    number_set_B0: $ => choice(
      "NAT",
      "NAT1",
      "INT"
    ),

    // Condidtions
    condition: $ => choice(
      prec.left(60, seq(
        $.simple_term,
        "=",
        $.simple_term
      )),
      prec.left(160, seq(
        $.simple_term,
        "/=",
        $.simple_term
      )),
      prec.left(160, seq(
        $.simple_term,
        "<=",
        $.simple_term
      )),
      prec.left(160, seq(
        $.simple_term,
        "<",
        $.simple_term
      )),
      prec.left(160, seq(
        $.simple_term,
        ">=",
        $.simple_term
      )),
      prec.left(160, seq(
        $.simple_term,
        ">",
        $.simple_term
      )),
      prec.left(40,seq(
        $.condition,
        "&",
        $.condition
      )),
      prec.left(40,seq(
        $.condition,
        "or",
        $.condition
      )),
      seq(
        "not",
        "(",
        $.condition,
        ")"
      )
    ),

    expr_array: $ => choice(
      seq(
        "{",
        separated_seq(
          ",",
          seq(
            separated_seq(
              "|->",
              $.simple_term
            ),
            "|->",
            $.term
          )
        ),
        "}"
      ),
      separated_seq(
        "or",
        seq(
          separated_seq(
            "*",
            $.range
          ),
          "*",
          "{",
          $.term,
          "}"
        )
      )
    ),

    interval_B0: $ => choice(
      seq(
        $.arithmetical_expression,
        "..",
        $.arithmetical_expression
      ),
      $.number_set_B0
    ),

    header_operation: $ => seq(
      optional(seq(
        separated_seq(
          ",",
          $.ident
        ),
        "<-"
      )),
      separated_seq(
        ".",
        $.ident
      ),
      optional(seq(
        "(",
        separated_seq(
          ",",
          $.ident
        ),
        ")"
      ))
    ),

    // Instructions
    instruction: $ => choice(
      $.level1_instruction,
      $.sequence_instruction
    ),

    level1_instruction: $ => choice(
      $.block_instruction,
      $.var_instruction,
      $.identity_substitution,
      $.becomes_equal_instruction,
      $.callup_instruction,
      $.if_instruction,
      $.case_instruction,
      $.assert_instruction,
      $.while_substitution
    ),

    level1_substitution: $ => choice(
      $.block_substitution,
      $.identity_substitution,
      $.becomes_equal_substitution,
      $.precondition_substitution,
      $.assertion_substitution,
      $.choice_limited_substitution,
      $.if_substitution,
      $.select_substitution,
      $.case_substitution,
      $.any_substitution,
      $.let_substitution,
      $.becomes_elt_substitution,
      $.becomes_such_that_substitution,
      $.var_substitution,
      $.call_up_substitution,
      $.while_substitution
    ),

    sequence_substitution: $ => prec.left(1, seq(
      $.substitution,
      ";",
      $.substitution
    )),

    simultaneous_substitution: $ => prec.left(1, seq(
      $.substitution,
      "||",
      $.substitution
    )),

    sequence_instruction: $ => prec.left(1, seq(
      $.instruction,
      ";",
      $.instruction
    )),

    block_instruction: $ => seq(
      "BEGIN",
      $.instruction,
      "END"
    ),

    var_instruction: $ => seq(
      "VAR",
      separated_seq(
        ",",
        $.ident
      ),
      "IN",
      $.instruction,
      "END"
    ),

    identity_substitution: $ => "skip",

    callup_instruction: $ => seq(
      optional(seq(
        separated_seq(
          ",",
          separated_seq(
            ".",
            $.ident
          )
        ),
        "<-"
      )),
      separated_seq(
        ".",
        $.ident
      ),
      optional($.seq_of_terms)
    ),

    seq_of_terms: $ => seq(
      "(",
      separated_seq(
        ",",
        choice(
          $.term,
          $.string_lit
        )
      ),
      ")"
    ),

    if_instruction: $ => seq(
      "IF",
      $.condition,
      "THEN",
      $.instruction,
      repeat(seq(
        "ELSIF",
        $.condition,
        "THEN",
        $.instruction
      )),
      optional(seq(
        "ELSE",
        $.instruction
      )),
      "END"
    ),

    case_instruction: $ => seq(
      "CASE",
      $.simple_term,
      "OF",
      "EITHER",
      separated_seq(
        ",",
        $.simple_term
      ),
      "THEN",
      $.instruction,
      repeat(seq(
        "OR",
        separated_seq(
          ",",
          $.simple_term
        ),
        "THEN",
        $.instruction
      )),
      optional(seq(
        "ELSE",
        $.instruction
      )),
      "END",
      "END"
    ),

    assert_instruction: $ => seq(
      "ASSERT",
      $.predicate,
      "THEN",
      $.instruction,
      "END"
    ),

    while_substitution: $ => seq(
      "WHILE",
      $.condition,
      "DO",
      $.instruction,
      "INVARIANT",
      $.predicate,
      "VARIANT",
      $.expression,
      "END"
    ),

    block_substitution: $ => seq(
      "BEGIN",
      $.substitution,
      "END"
    ),

    becomes_equal_substitution: $ => choice(
      seq(
        separated_seq(
          ",",
          separated_seq(
            ".",
            $.ident
          )
        ),
        ":=",
        separated_seq(
          ",",
          $.expression
        )
      ),
      seq(
        separated_seq(
          ".",
          $.ident
        ),
        "(",
        separated_seq(
          ",",
          $.expression
        ),
        ")",
        ":=",
        $.expression
      )
    ),

    precondition_substitution: $ => seq(
      "PRE",
      $.predicate,
      "THEN",
      $.substitution,
      "END"
    ),

    assertion_substitution: $ => seq(
      "ASSERT",
      $.predicate,
      "THEN",
      $.substitution,
      "END"
    ),

    choice_limited_substitution: $ => seq(
      "CHOICE",
      $.substitution,
      repeat(seq(
        "OR",
        $.substitution
      )),
      "END"
    ),

    if_substitution: $ => seq(
      "IF",
      $.predicate,
      "THEN",
      $.substitution,
      repeat(seq(
        "ELSIF",
        $.predicate,
        "THEN",
        $.substitution
      )),
      optional(seq(
        "ELSE",
        $.substitution
      )),
      "END"
    ),

    select_substitution: $ => seq(
      "SELECT",
      $.predicate,
      "THEN",
      $.substitution,
      repeat(seq(
        "WHEN",
        $.predicate,
        "THEN",
        $.substitution
      )),
      optional(seq(
        "ELSE",
        $.substitution
      )),
      "END"
    ),

    case_substitution: $ => seq(
      "CASE",
      $.expression,
      "OF",
      "EITHER",
      separated_seq(
        ",",
        $.simple_term
      ),
      "THEN",
      $.substitution,
      repeat(seq(
        "OR",
        separated_seq(
          ",",
          $.simple_term
        ),
        "THEN",
        $.substitution
      )),
      optional(seq(
        "ELSE",
        $.substitution
      )),
      "END",
      "END"
    ),

    any_substitution: $ => seq(
      "ANY",
      separated_seq(
        ",",
        $.ident
      ),
      "WHERE",
      $.predicate,
      "THEN",
      $.substitution,
      "END"
    ),

    let_substitution: $ => seq(
      "LET",
      separated_seq(
        ",",
        $.ident
      ),
      "BE",
      separated_seq(
        "&",
        seq(
          $.ident,
          "=",
          $.expression
        )
      ),
      "IN",
      $.substitution,
      "END"
    ),

    becomes_elt_substitution: $ => seq(
      separated_seq(
        ",",
        separated_seq(
          ".",
          $.ident
        )
      ),
      "::",
      $.expression
    ),

    becomes_such_that_substitution: $ => seq(
      separated_seq(
        ",",
        separated_seq(
          ".",
          $.ident
        )
      ),
      ":",
      "(",
      $.predicate,
      ")"
    ),

    var_substitution: $ => seq(
      "VAR",
      separated_seq(
        ",",
        $.ident
      ),
      "IN",
      $.substitution,
      "END"
    ),

    call_up_substitution: $ => seq(
      optional(seq(
        separated_seq(
          ",",
          separated_seq(
            ".",
            $.ident
          )
        ),
        "<--"
      )),
      separated_seq(
        ".",
        $.ident
      ),
      optional(seq(
        "(",
        separated_seq(
          ",",
          $.expression
        ),
        ")"
      ))
    ),

    clause_definitions: $ => seq(
      "DEFINITIONS",
      separated_seq(
        $.definition,
        ";"
      )
    ),

    definition: $ => choice(
      seq(
        $.ident,
        optional(
          seq(
            "(",
            separated_seq(
              ",",
              $.ident
            ),
            ")"
          )
        )
      ),
      seq(
        "<",
        $.filename,
        ">"
      ),
      seq(
        '"',
        $.filename,
        '"'
      )
    ),

    filename: $ => seq(
      $.ident,
      ".def"
    )
  }
});

function separated_seq(sep, elem) {
return seq(elem, repeat(seq(sep, elem)));
}
