module.exports = grammar({
  name: 'B_language',

  rules: {

    source_file: $ => $.component,

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

    clause_machine_abstract: $ => choice(
      clause_constraints,
      clause_sees,
      clause_includes,
      clause_promotes,
      clause_extends,
      clause_uses,
      clause_sets,
      clause_concrete_constants,
      clause_abstract_constants,
      clause_properties,
      clause_concrete_variables,
      clause_abstract_variables,
      clause_invariant,
      clause_assertions,
      clause_initialization,
      clause_operations
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

    refinement: $ => seq(
      "REFINEMENT",
      $.header,
      $.clause_refines,
      repeat($.clause_refinement),
      "END"
    ),

    clause_refinement: $ => choice(
      clause_sees,
      clause_includes,
      clause_promotes,
      clause_extends,
      clause_sets,
      clause_concrete_constants,
      clause_abstract_constants,
      clause_properties,
      clause_concrete_variables,
      clause_abstract_variables,
      clause_invariant,
      clause_assertions,
      clause_initialization,
      clause_operations
    ),

    implementation: $ => seq(
      "IMPLEMENTATION",
      $.header,
      $.clause_refines,
      repeat($.clause_implementation),
      "END"
    ),

    clause_implementation: $ => choice(
      clause_sees,
      clause_imports,
      clause_promotes,
      clause_extends_B0,
      clause_sets,
      clause_concrete_constants,
      clause_properties,
      clause_values,
      clause_concrete_variables,
      clause_invariant,
      clause_assertions,
      clause_initialization_B0,
      clause_operations_B0
    ),

    clause_constraints: $ => seq(
      "CONSTRAINTS",
      separated_seq(
        "&",
        $.identpredicate
      )
    ),

    clause_refines: $ => seq(
      "REFINES",
      $.ident
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
          optional(
            "(",
            separated_seq(
              ",",
              $.instanciation_B0
            ),
            ")"
          )
        )
      )
    ),

    instanciation_B0: $ => choice(
      $.term,
      $.number_set_B0,
      $.bool,
      $.interval
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
          optional(seq(
            $.ident,
            "."
          )),
          $.ident,
          optional(
            "(",
            separated_seq(
              ",",
              $.instanciation
            ),
            ")"
          )
        )
      )
    ),

    instanciation: $ => choice(
      $.terme,
      $.number_set,
      "BOOL",
      $.interval
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
          optional(
            "(",
            separated_seq(
              ",",
              $.instantiating
            ),
            ")"
          )
        )
      )
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
          optional(
            "(",
            separated_seq(
              ",",
              $.instanciing_B0
            ),
            ")"
          )
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
      separated_seq(
        "&",
        $.predicate
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
          "Bool",
          "(",
          $.condition,
          ")"
        ),
        $.expr_array,
        $.interval_B0
      )
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
      separated_seq(
        "&",
        $.predicate
      )
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

    operation: $ => seq(
      $.header_operation,
      "=",
      $.level1_substitution
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
      $.integer_lit,
      $.boolean_lit
    ),

    integer_lit: $ => choice(
      $.integer_literal,
      "MAXINT",
      "MININT"
    ),

    boolean_lit: $ => choice(
      "TRUE",
      "FALSE"
    ),

    arithmetical_expression: $ => choice(
      $.integer_lit,
      separated_seq(
        ".",
        $.ident
      ),
      seq(
        $.arithmetical_expression,
        choice(
          "+",
          "-",
          "*",
          "/",
          "mod",
          "**"
        ),
        $.arithmetical_expression
      ),
      seq(
        "-",
        $.arithmetical_expression
      ),
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
      )
    ),

    expr_array: $ => choice(
      $.ident,
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

    range: $ => choice(
      $.ident,
      $.interval_B0,
      seq(
        "{",
        separated_seq(
          ",",
          $.simple_term
        ),
        "}"
      )
    ),

    interval_B0: $ => choice(
      seq(
        $.arithmetical_expression,
        "..",
        $.arithmetical_expression
      ),
      number_set_B0
    ),

    number_set_B0: $ => choice(
      "NAT",
      "NAT1",
      "INT"
    ),

    // Condidtions
    condition: $ => choice(
      seq(
        $.simple_term,
        choice(
          "=",
          "/=",
          "<",
          ">",
          "<=",
          ">="
        ),
        $.simple_term
      ),
      seq(
        $.condition,
        choice(
          "&",
          "or"
        ),
        $.condition
      ),
      "not",
      "(",
      $.condition,
      ")"
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

    becomes_equal_instruction: $ => choice(
      seq(
        separated_seq(
          ".",
          $.ident
        ),
        optional(
          "(",
          separated_seq(
            ",",
            $.term
          ),
          ")"
        ),
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
      optional(seq(
        "(",
        separated_seq(
          ",",
          choice(
            $.term,
            $.string_lit
          )
        ),
        ")"
      ))
    ),

    sequence_instruction: $ => seq(
      $.instruction,
      ";",
      $.instruction
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

    // Predicates
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
      seq(
        $.predicate,
        choice(
          "&",
          "or",
          "=>",
          "<=>"
        ),
        $.predicate
      ),
      seq(
        "!",
        $.list_ident,
        ".",
        "(",
        $.predicate,
        "=>",
        $.predicate,
        ")"
      ),
      seq(
        "#",
        $.list_ident,
        ".",
        "(",
        $.predicate,
        ")"
      ),
      seq(
        $.expression,
        choice(
          "=",
          "/=",
          ":",
          "/:",
          "<:",
          "<<:",
          "/<:",
          "/<<:",
          "<=",
          "<",
          ">=",
          ">"
        ),
        $.expression
      )
    ),

    // Expressions
    expression: $ => choice(
      $.expression_primary,
      $.expression_boolean,
      $.expression_arithmetical,
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

    expression_boolean: $ => choice(
      $.boolean_lit,
      $.conversion_bool
    ),

    expression_arithmetical: $ => choice(
      $.integer_lit,
      seq(
        $.expression,
        choice(
          "+",
          "-",
          "*",
          "/",
          "mod",
          "**"
        ),
        $.expression
      ),
      seq(
        "-",
        $.expression
      ),
      seq(
        choice(
          "succ",
          "pred"
        ),
        optional(seq(
          "(",
          $.expression,
          ")"
        ))
      ),
      seq(
        choice(
          "max",
          "min",
          "card",
          "floor",
          "ceiling",
          "real"
        ),
        "(",
        $.expression,
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
        separated_seq(
          "&",
          $.predicate
        ),
        "|",
        $.expression,
        ")"
      )
    ),

    expression_of_couples: $ => seq(
      $.expression,
      choice(
        "|->",
        ","
      ),
      $.expression
    ),

    expression_of_sets: $ => choice(
      seq(
        "{",
        "}"
      ),
      $.number_set,
      "BOOL",
      "STRING"
    ),

    construction_of_sets: $ => choice(
      $.product,
      $.comprehension_set,
      $.subsets,
      $.finite_subsets,
      $.set_extension,
      $.interval,
      $.difference,
      $.union,
      $.intersection,
      $.generalized_union,
      $.generalized_intersection,
      $.quantified_union,
      $.quantified_intersection
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
      $.restriction,
      $.antirestriction,
      $.corestriction,
      $.anticorestriction,
      $.overwrite
    ),

    expression_of_functions: $ => choice(
      $.partial_function,
      $.total_function,
      $.partial_injection,
      $.total_injection,
      $.partial_surjection,
      $.total_surjection,
      $.total_bijection
    ),

    construction_of_functions: $ => choice(
      $.lambda_expression,
      $.function_constant,
      $.evaluation_function,
      $.transformed_function,
      $.transformed_relation
    ),

    expression_of_sequences: $ => choice(
      $.sequences,
      $.non_empty_sequences,
      $.injective_sequences,
      $.non_empty_inj_sequences,
      $.permutations
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

    conversion_bool: $ => seq(
      "bool",
      "(",
      $.predicate,
      ")"
    ),

    number_set: $ => choice(
      "INTEGER",
      "NATURAL",
      "NATURAL1",
      "NAT",
      "NAT1",
      "INT"
    ),


  }
});

function separated_seq(sep, elem) {
  return seq(elem, repeat(seq(sep, elem)));
}
