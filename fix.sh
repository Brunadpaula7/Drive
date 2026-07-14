head -n 137 components/OpenSalesSection.tsx > tmp.tsx
cat << 'INNER_EOF' >> tmp.tsx
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186A2.25 2.25 0 0115 12a2.25 2.25 0 01-2.783 2.186m2.783-2.186l-1.5 1.5M15 12l-1.5-1.5M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186A2.25 2.25 0 0115 12a2.25 2.25 0 01-2.783 2.186m2.783-2.186l-1.5 1.5M15 12l-1.5-1.5" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default OpenSalesSection;
INNER_EOF
mv tmp.tsx components/OpenSalesSection.tsx
